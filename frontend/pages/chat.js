import { useState } from "react";
import axios from "axios";

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: "'Manrope', sans-serif",
    backgroundColor: '#fef9ed',
    display: 'flex',
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#f8f3e7',
    padding: '40px 24px',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #e7e2d6',
  },
  logo: {
    fontFamily: "'Newsreader', serif",
    fontSize: '32px',
    fontStyle: 'italic',
    color: '#E27396',
    marginBottom: '48px',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: '40px 60px',
  },
  header: {
    marginBottom: '40px',
  },
  docIdInput: {
    border: 'none',
    borderBottom: '1px solid #e7e2d6',
    padding: '8px 0',
    fontSize: '14px',
    width: '200px',
    marginBottom: '24px',
    outline: 'none',
  },
  questionInput: {
    width: '100%',
    padding: '20px 24px',
    borderRadius: '16px',
    border: '1px solid #e7e2d6',
    fontSize: '16px',
    outline: 'none',
    marginBottom: '20px',
  },
  resultPane: {
    flex: 1,
    overflowY: 'auto',
    paddingRight: '20px',
  },
  answerSection: {
    marginBottom: '40px',
  },
  answerHeadline: {
    fontFamily: "'Newsreader', serif",
    fontSize: '32px',
    fontStyle: 'italic',
    color: '#651745',
    marginBottom: '16px',
  },
  answerText: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#534249',
  },
  infoSidebar: {
    width: '320px',
    backgroundColor: '#fcfaf5',
    padding: '40px 32px',
    borderLeft: '1px solid #e7e2d6',
  },
  sidebarTitle: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#7a5461',
    marginBottom: '24px',
    fontWeight: '700',
  },
  sourceCard: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #e7e2d6',
    marginBottom: '16px',
    fontSize: '13px',
  }
};

export default function Chat() {
  const [docId, setDocId] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!docId || !question) return;
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/ask", {
        doc_id: docId,
        question: question,
      });
      setResponse(res.data);
    } catch (error) {
      console.error("Query failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>QDoc.</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={styles.navItem}>Library</div>
          <div style={{...styles.navItem, color: '#E27396'}}>Conversations</div>
          <div style={styles.navItem}>Insights</div>
          <div style={styles.navItem}>Settings</div>
        </nav>
      </aside>

      <main style={styles.chatArea}>
        <header style={styles.header}>
          <input
            placeholder="Document ID"
            value={docId}
            onChange={(e) => setDocId(e.target.value)}
            style={styles.docIdInput}
          />
          <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: '24px', color: '#651745' }}>
            Dialogue with your manuscript
          </h2>
        </header>

        <div style={styles.resultPane}>
          {response ? (
            <div style={styles.answerSection}>
              <h3 style={styles.answerHeadline}>Insights Extracted</h3>
              <p style={styles.answerText}>{response.answer}</p>
            </div>
          ) : (
            <div style={{ color: '#a68d95', fontStyle: 'italic', marginTop: '100px', textAlign: 'center' }}>
              Your manuscript's voice is waiting. Ask a question below.
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <input
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={styles.questionInput}
            onKeyPress={(e) => e.key === 'Enter' && askQuestion()}
          />
          <button 
            onClick={askQuestion} 
            disabled={loading}
            style={{
              position: 'absolute',
              right: '12px',
              top: '10px',
              backgroundColor: '#E27396',
              color: 'white',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            {loading ? "..." : "Ask"}
          </button>
        </div>
      </main>

      {response && (
        <aside style={styles.infoSidebar}>
          <h4 style={styles.sidebarTitle}>Inference Details</h4>
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '14px', color: '#651745' }}><b>Confidence Score:</b> {response.confidence}</p>
            <p style={{ fontSize: '12px', color: '#7a5461', marginTop: '8px' }}><i>Caveat: {response.caveat}</i></p>
          </div>

          <h4 style={styles.sidebarTitle}>Cited Sources</h4>
          {response.sources.map((s, i) => (
            <div key={i} style={styles.sourceCard}>
              <div style={{ color: '#E27396', fontWeight: '700', marginBottom: '8px' }}>Source Rank: {s.score}</div>
              <div style={{ color: '#534249', lineHeight: '1.5' }}>{s.text}</div>
            </div>
          ))}
        </aside>
      )}
    </div>
  );
}
