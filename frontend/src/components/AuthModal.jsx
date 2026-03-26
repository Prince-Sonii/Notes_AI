import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { FaTimes, FaUser, FaLock } from 'react-icons/fa';
import '../App.css';

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Reset mode whenever the modal opens or initialMode changes
    useEffect(() => {
        setIsLogin(initialMode === 'login');
        setUsername('');
        setPassword('');
    }, [initialMode, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/auth/login' : '/auth/register';

        try {
            await api.post(endpoint, { username, password });

            if (isLogin) {
                toast.success('Welcome back! 👋');
                navigate('/dashboard');
            } else {
                toast.success('Account created! Logging you in...');
                await api.post('/auth/login', { username, password });
                navigate('/dashboard');
            }
            onClose();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data || 'Something went wrong';
            toast.error(msg);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <FaTimes />
                </button>

                {/* Decorative gradient top */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #6366f1, #c084fc)',
                    borderRadius: '24px 24px 0 0'
                }} />

                <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                    <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(192, 132, 252, 0.1))',
                        border: '1px solid rgba(129, 140, 248, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                        fontSize: '1.3rem',
                        color: '#818cf8'
                    }}>
                        {isLogin ? <FaUser /> : '✦'}
                    </div>
                    <h2 style={{
                        color: '#f8fafc',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        letterSpacing: '-0.3px',
                        margin: 0
                    }}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{
                        color: '#64748b',
                        fontSize: '0.9rem',
                        marginTop: '0.4rem'
                    }}>
                        {isLogin ? 'Enter your credentials to continue' : 'Start your note-taking journey'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="note-form" style={{
                    padding: 0,
                    boxShadow: 'none',
                    background: 'transparent',
                    border: 'none',
                    gap: '0.75rem'
                }}>
                    <div style={{ position: 'relative' }}>
                        <FaUser style={{
                            position: 'absolute',
                            left: '0.85rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#64748b',
                            fontSize: '0.85rem'
                        }} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            required
                            autoFocus
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <FaLock style={{
                            position: 'absolute',
                            left: '0.85rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#64748b',
                            fontSize: '0.85rem'
                        }} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="form-input"
                            style={{ paddingLeft: '2.5rem' }}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{
                        width: '100%',
                        marginTop: '0.75rem',
                        padding: '0.75rem'
                    }}>
                        {isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <p className="auth-switch">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="btn-link"
                    >
                        {isLogin ? 'Register here' : 'Login here'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default AuthModal;