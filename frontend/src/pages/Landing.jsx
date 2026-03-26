import { useState } from 'react';
import AuthModal from '../components/AuthModal';
import { Toaster } from 'react-hot-toast';
import { FaRocket, FaShieldAlt, FaBolt, FaSearch } from 'react-icons/fa';
import '../App.css';

function Landing() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('login');

    const openModal = (mode) => {
        setModalMode(mode);
        setModalOpen(true);
    };

    return (
        <div className="landing-container">
            <Toaster position="top-center" toastOptions={{
                style: {
                    background: '#1a1a2e',
                    color: '#e2e8f0',
                    border: '1px solid rgba(255,255,255,0.06)',
                }
            }} />

            <AuthModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                initialMode={modalMode}
            />

            <nav className="landing-nav">
                <div className="logo">✦ AI Notes</div>
                <div className="nav-links">
                    <button onClick={() => openModal('login')} className="btn btn-outline">
                        Login
                    </button>
                    <button onClick={() => openModal('register')} className="btn btn-primary">
                        Sign Up
                    </button>
                </div>
            </nav>

            <main className="hero-section">
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.4rem 1rem',
                    borderRadius: '50px',
                    background: 'rgba(129, 140, 248, 0.08)',
                    border: '1px solid rgba(129, 140, 248, 0.15)',
                    color: '#818cf8',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    marginBottom: '2rem',
                    letterSpacing: '0.02em'
                }}>
                    <FaBolt style={{ fontSize: '0.75rem' }} />
                    AI-Powered Semantic Search
                </div>

                <h1 className="hero-title">
                    Capture Your Thoughts, <br />
                    <span className="highlight">Unleash Your Creativity.</span>
                </h1>
                <p className="hero-subtitle">
                    The secure, minimal, and smart way to organize your ideas.
                    Powered by AI for intelligent search and instant retrieval.
                </p>
                <div className="hero-buttons">
                    <button onClick={() => openModal('register')} className="btn btn-primary btn-large">
                        <FaRocket style={{ fontSize: '0.9rem' }} />
                        Get Started Free
                    </button>
                    <button onClick={() => openModal('login')} className="btn btn-outline btn-large">
                        Login
                    </button>
                </div>

                {/* Feature highlights */}
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    marginTop: '4rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    {[
                        { icon: <FaShieldAlt />, label: 'Secure & Private' },
                        { icon: <FaSearch />, label: 'AI Search' },
                        { icon: <FaBolt />, label: 'Lightning Fast' },
                    ].map((feat, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#64748b',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                        }}>
                            <span style={{ color: '#818cf8', fontSize: '0.85rem' }}>{feat.icon}</span>
                            {feat.label}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Landing;