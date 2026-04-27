from ingestion.embedder import embed_chunks
from storage.vectordb import search

def retrieve(question, top_k=3):
    query_embedding = embed_chunks([question])[0]
    results = search(query_embedding, top_k)
    return results["matches"]


