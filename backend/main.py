from fastapi import FastAPI, UploadFile, File 
import uuid 

from pipeline import process_document
from rag.responder import answer_question
from ingestion.extractor import extract_from_text
from storage.postgres import list_documents

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/documents/upload")
async def upload(file: UploadFile = File(...)):
    doc_id = str(uuid.uuid4())

    file_bytes = await file.read()

    process_document(file_bytes, doc_id, file.filename)

    return {"doc_id": doc_id}

@app.get("/documents")
def get_documents():
    return list_documents()

from pydantic import BaseModel

class AskRequest(BaseModel):
    doc_id: str
    question: str


@app.post("/ask")
def ask(req: AskRequest):
    return answer_question(req.question, req.doc_id)