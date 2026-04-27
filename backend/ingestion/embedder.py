from dotenv import load_dotenv
import os
load_dotenv()

from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def embed_chunks(chunks) :
    response = client.embeddings.create(model="text-embedding-3-small", input=chunks)
    return [item.embedding for item in response.data] 

