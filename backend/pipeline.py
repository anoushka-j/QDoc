from ingestion.extractor import extract_from_text
import re 
from ingestion.chunker import clean_text, chunk_text, is_bad_chunk
from ingestion.embedder import embed_chunks
from storage.vectordb import upsert_chunks
from rag.responder import answer_question
from storage.postgres import create_document, update_document


def process_document(file_bytes, doc_id, filename) : 
    create_document(doc_id, filename)

    text = extract_from_text(file_bytes)
    text = clean_text(text)
    chunks = chunk_text(text)
    chunks = [c for c in chunks if not is_bad_chunk(c)]
    embeddings = embed_chunks(chunks)

    upsert_chunks(doc_id, chunks, embeddings)
    update_document(doc_id, len(chunks))

def run_test(): 
    doc_id="analogy_doc"
    filename="Research paper.pdf"
    answer = answer_question("What is T5?", "analogy_doc", 3)
    print(answer['answer'])

