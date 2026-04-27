
from pinecone import Pinecone, ServerlessSpec
from ingestion.embedder import embed_chunks
import os

def search(query: str, top_k=3, doc_id=str):
    query_embedding = embed_chunks([query])[0]

    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        filter={
            "document_id": doc_id  # 🔥 THIS IS THE FIX
        }, 
        include_metadata=True
    )

    return results    



p = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
p.delete_index('qdoc')

if "qdoc" not in [i.name for i in p.list_indexes()]:
    p.create_index(
    name="qdoc",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(
        cloud="aws",
        region="us-east-1"
    )
)
index = p.Index("qdoc")
def upsert_chunks(doc_id, chunks, embeddings) : 
    print("INSIDE UPSERT FUNCTION")  # 👈 add this
    vectors = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)) : 
          vectors.append({
            "id": f"{doc_id}_{i}",
            "values": embedding,
            "metadata": {
                "text": chunk,
              
                "document_id": doc_id,
                "chunk_index": i
            }
        })
          
    print("Upserting", len(vectors), "vectors")
    index.upsert(vectors=vectors)


