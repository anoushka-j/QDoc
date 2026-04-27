# 🧠 QDoc - AI Document Q&A System (RAG Pipeline)

QDoc is a full-stack **Retrieval-Augmented Generation (RAG)** system that allows users to upload PDFs and ask natural-language questions about their contents. The system retrieves relevant document chunks using vector search and generates grounded answers with confidence scoring and caveats.

---

## 🚀 Features

* 📄 Upload and process PDF documents
* ✂️ Token-aware chunking with overlap for better context retention
* 🔎 Semantic search using vector embeddings
* 🧠 LLM-powered answers grounded in retrieved context
* 📊 Confidence scoring based on retrieval similarity
* ⚠️ Caveat generation to surface uncertainty
* 📚 Source attribution (chunk + page references)
* 🌐 Full-stack interface with upload + chat

---

## 🏗️ Architecture

```
User (Next.js frontend)
        ↓
FastAPI backend
        ↓
Text extraction → Chunking → Embeddings
        ↓
Vector DB (Pinecone)
        ↓
Retriever (top-k chunks)
        ↓
LLM (OpenAI)
        ↓
Answer + Sources + Confidence + Caveat
```

---

## 🧩 Tech Stack

**Frontend**

* Next.js (Pages Router)

**Backend**

* FastAPI (Python)

**AI / Retrieval**

* OpenAI (embeddings + LLM)
* Pinecone (vector database)

**Data**

* PostgreSQL (document metadata)

---

## 📂 Project Structure

```
qdoc/
│
├── backend/
│   ├── main.py           # FastAPI app + routes
│   ├── pipeline.py       # ingestion pipeline
│   ├── config.py         # environment variables
│   │
│   ├── ingestion/        # PDF → text → chunks
│   ├── rag/              # retrieval + answer generation
│   ├── storage/          # Pinecone + Postgres
│
├── frontend/
│   ├── pages/            # UI routes (upload + chat)
│   └── package.json
│
├── docs/
│   └── architecture.md   # system design explanation
│
├── tests/
│   ├── test_ingestion.py
│   └── test_rag.py
│
├── .env.example
├── requirements.txt
├── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/your-username/qdoc.git
cd qdoc
```

---

### 2. Backend setup

```
cd backend
pip install -r ../requirements.txt
```

Create a `.env` file:

```
cp ../.env.example .env
```

Add your keys:

```
OPENAI_API_KEY=your_key
PINECONE_API_KEY=your_key
DATABASE_URL=your_postgres_url
```

Run backend:

```
uvicorn main:app --reload
```

Open:

👉 http://localhost:8000/docs

---

### 3. Frontend setup

Open a new terminal:

```
cd frontend
npm install
npm run dev
```

Open:

👉 http://localhost:3000

---

## 🧪 Usage

### 1. Upload a document

* Upload a PDF from the homepage
* Receive a `doc_id`

### 2. Ask questions

* Navigate to `/chat`
* Enter your `doc_id`
* Ask questions about the document

---

## 🧠 How It Works

### 1. Ingestion Pipeline

* Extract text from PDF
* Clean and normalize text
* Split into token-limited chunks with overlap
* Generate embeddings using OpenAI
* Store vectors in Pinecone with metadata

---

### 2. Retrieval

* Convert user query into embedding
* Perform similarity search in Pinecone
* Filter results by `document_id`
* Return top-k relevant chunks

---

### 3. Answer Generation

* Construct context from retrieved chunks
* Pass context + question to LLM
* Generate grounded response

---

### 4. Confidence & Caveats

* Confidence derived from top similarity scores
* Caveats generated when:

  * scores are low
  * context is sparse
  * terminology may be inconsistent

---

## 📊 Example Output

```json
{
  "answer": "BERT is a transformer-based model used for natural language processing tasks.",
  "confidence": 0.72,
  "sources": [
    {
      "page": 12,
      "text": "...",
      "score": 0.78
    }
  ],
  "caveat": "Moderate confidence — answer is based on limited context."
}
```

---

## 🧠 Key Design Decisions

* **Chunking with overlap** improves semantic continuity
* **Vector search (Pinecone)** enables scalable retrieval
* **Metadata filtering** ensures document isolation
* **Confidence scoring** prevents over-trusting LLM output
* **Caveat system** adds transparency and realism

---

## 🚧 Future Improvements

* Better UI (chat-style interface with streaming responses)
* Highlight source text in frontend
* Automatic document selection (remove manual doc_id input)
* Hybrid search (keyword + semantic)
* Async/background document processing
* Authentication and multi-user support

---

## 🧪 Testing

```
pytest tests/
```

---

## 🔐 Environment Variables

See `.env.example`:

```
OPENAI_API_KEY=
PINECONE_API_KEY=
DATABASE_URL=
```

---

## 📌 Notes

* `.env`, `node_modules`, and `.next` are excluded via `.gitignore`
* Do not commit API keys

---

## 📣 Summary

This project demonstrates a **production-style RAG system** with:

* full-stack architecture
* vector search + LLM integration
* explainability via confidence and caveats
* clean modular backend design

---

## ⭐ If you found this useful

Consider starring the repo or reaching out!

---
