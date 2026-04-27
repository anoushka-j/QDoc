import psycopg2

conn = psycopg2.connect(
    "postgresql://postgres:postgres@localhost:5432/qdoc"
)

cur = conn.cursor()
cur.execute("SELECT current_database();")
print(cur.fetchone())

def init_db() : 
    cur.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        filename TEXT,
        status TEXT,
        num_chunks INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    cur.commit()


cur.execute("SELECT* FROM documents;")
print(cur.fetchall())


def create_document(doc_id, filename):
    cur.execute(
        "INSERT INTO documents (id, filename, status) VALUES (%s, %s, %s)",
        (doc_id, filename, "processing")
    )
    conn.commit()


def update_document(doc_id, num_chunks):
    cur.execute(
        "UPDATE documents SET status=%s, num_chunks=%s WHERE id=%s",
        ("ready", num_chunks, doc_id)
    )
    conn.commit()


def list_documents():
    cur.execute("SELECT * FROM documents ORDER BY created_at DESC")
    return cur.fetchall()

print(list_documents())