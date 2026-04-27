import { useState } from "react";
import axios from "axios";

// Styling constants based on the QDoc. Web Atmospheric design
const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: "'Manrope', sans-serif",
    backgroundColor: '#fef9ed',
    display: 'flex',
    flexDirection: 'row',
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
  navItem: {
    padding: '12px 0',
    color: '#7a5461',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontWeight: '500',
  },
  main: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backgroundImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.15,
    zIndex: 0,
  },
  uploadCard: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '60px',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '560px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(226, 115, 150, 0.05)',
  },
  headline: {
    fontFamily: "'Newsreader', serif",
    fontStyle: 'italic',
    fontSize: '48px',
    color: '#651745',
    marginBottom: '16px',
  },
  subheadline: {
    color: '#7a5461',
    lineHeight: '1.6',
    marginBottom: '40px',
  },
  dropzone: {
    border: '2px dashed #e7e2d6',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  button: {
    backgroundColor: '#E27396',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  successBox: {
    marginTop: '32px',
    padding: '24px',
    backgroundColor: '#fef9ed',
    borderRadius: '12px',
    border: '1px solid #e7e2d6',
  }
};

export default function Home() {
  const [file, setFile] = useState(null);
  const [docId, setDocId] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/documents/upload",
        formData
      );
      setDocId(res.data.doc_id);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>QDoc.</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{...styles.navItem, color: '#E27396'}}>Library</div>
          <div style={styles.navItem}>Conversations</div>
          <div style={styles.navItem}>Insights</div>
          <div style={styles.navItem}>Settings</div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={styles.main}>
        <img 
          src="https://images.unsplash.com/photo-1513002749550-c59d786b8e6c" 
          alt="Clouds" 
          style={styles.backgroundImg} 
        />
        
        <div style={styles.uploadCard}>
          <h1 style={styles.headline}>Transmute Drafts into Mastery.</h1>
          <p style={styles.subheadline}>
            Your words deserve an atmosphere of elegance. Add your manuscript 
            to the editorial queue for deep thematic extraction.
          </p>

          <div style={styles.dropzone}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ width: '100%' }}
            />
          </div>

          <button 
            onClick={uploadFile} 
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              transform: loading ? 'scale(0.98)' : 'none'
            }}
          >
            {loading ? "Processing..." : "Initiate Submission"}
          </button>

          {docId && (
            <div style={styles.successBox}>
              <p style={{ color: '#651745', fontWeight: '600' }}>
                Document Processed Successfully
              </p>
              <p style={{ margin: '8px 0', fontSize: '14px', color: '#7a5461' }}>
                <b>Doc ID:</b> {docId}
              </p>
              <a 
                href="/chat" 
                style={{ 
                  color: '#E27396', 
                  textDecoration: 'none', 
                  fontSize: '14px',
                  fontWeight: '700'
                }}
              >
                Go to chat →
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
