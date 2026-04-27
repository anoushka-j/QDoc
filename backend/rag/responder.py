
from storage.vectordb import search
from rag.confidence import compute_confidence
from rag.caveats import generate_caveat
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
def answer_question(question, doc_id, top_k=3):
    # 1. retrieve
    results = search(question, top_k=top_k, doc_id=doc_id)
    matches = results["matches"]
   # print(matches)
    #matches = [m for m in matches if not is_bad_chunk(m)]
   # print(len(matches))

    if not matches:
        return {
            "answer": "No relevant information found.",
            "confidence": 0.0,
            "sources": [],
            "caveat": "No matching chunks retrieved."
        }

    # 2. extract chunks
    top_chunks = [m["metadata"]["text"] for m in matches]
    context = "\n\n".join(top_chunks)

    # 3. compute confidence + caveat
    confidence = compute_confidence(matches)
    caveat = generate_caveat(matches, confidence)

    # 4. LLM ONLY generates answer
    prompt = f"""
    You are answering questions about a document.

    Use ONLY the provided context.
    If the answer is not clearly stated, say "Not found in document."

    Context:
    {context}

    Question: {question}

    Answer with as much details from all sources as possible. 
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    answer = response.choices[0].message.content

    # 5. return structured result
    return {
        "answer": answer,
        "confidence": confidence,
        "sources": [
            {
                "text": m["metadata"]["text"],
                "score": m["score"],
                "chunk_index": m["metadata"]["chunk_index"]
            }
            for m in matches
        ],
        "caveat": caveat
    }