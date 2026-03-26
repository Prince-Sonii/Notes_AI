import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import '../App.css';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { FaTrash, FaPencilAlt, FaSearch, FaPlus, FaSignOutAlt, FaStickyNote } from 'react-icons/fa';

function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // 1. Fetch notes when the page loads
    useEffect(() => {
        fetchNotes();
    }, []);

const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            fetchNotes(); // Reset to all notes if empty
            return;
        }

        setIsSearching(true);
        try {
            const response = await api.get(`/notes/search?query=${searchQuery}`);
            setNotes(response.data);
            toast.success(`Found ${response.data.length} relevant notes`);
        } catch (error) {
            console.error(error);
            toast.error("Search failed");
        } finally {
            setIsSearching(false);
        }
    };

const handleEdit = async (note) => {
        // Open SweetAlert Modal
        const { value: formValues } = await Swal.fire({
            title: 'Edit Note',
            html: `
                <input id="swal-input1" class="swal2-input" value="${note.title}" placeholder="Title">
                <textarea id="swal-input2" class="swal2-textarea" placeholder="Content" style="height: 100px;">${note.content}</textarea>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            confirmButtonText: 'Update',
            background: '#1a1a2e',
            color: '#e2e8f0',
            preConfirm: () => {
                return [
                    document.getElementById('swal-input1').value,
                    document.getElementById('swal-input2').value
                ];
            }
        });

        // If user clicked "Update"
        if (formValues) {
            const [newTitle, newContent] = formValues;

            try {
                const response = await api.put(`/notes/${note.id}`, {
                    title: newTitle,
                    content: newContent
                });

                setNotes(notes.map(n => n.id === note.id ? response.data : n));
                toast.success('Note updated successfully!');
            } catch (error) {
                console.error("Update failed", error);
                toast.error('Failed to update note.');
            }
        }
    };

    const fetchNotes = async () => {
            try {
                const response = await api.get('/notes');
                console.log("API Response:", response.data);

                if (Array.isArray(response.data)) {
                    setNotes(response.data);
                } else {
                    console.error("Unexpected data format:", response.data);
                    setNotes([]);
                }
            } catch (error) {
                console.error("Error fetching notes:", error);
                if (error.response && error.response.status === 403) {
                    navigate('/login');
                }
            }
        };

    // 2. Create a new Note
    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!title || !content) return;

        try {
            await api.post('/notes', { title, content });
            setTitle('');
            setContent('');
            fetchNotes();
        } catch (error) {
            alert('Failed to save note');
        }
    };

    // 3. Delete a Note
        const handleDelete = async (id) => {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#6366f1',
                confirmButtonText: 'Yes, delete it!',
                background: '#1a1a2e',
                color: '#e2e8f0',
            });

            if (result.isConfirmed) {
                try {
                    await api.delete(`/notes/${id}`);
                    setNotes(notes.filter(note => note.id !== id));
                    toast.success('Note deleted successfully', {
                        icon: '🗑️',
                        style: {
                            borderRadius: '10px',
                            background: '#1a1a2e',
                            color: '#e2e8f0',
                            border: '1px solid rgba(255,255,255,0.06)',
                        },
                    });
                } catch (error) {
                    console.error("Delete failed", error);
                    toast.error('Failed to delete note.');
                }
            }
        };

    // 4. Logout
    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
            navigate('/login');
        }
    };

    return (
            <div className="container">
                <Toaster position="top-right" toastOptions={{
                    style: {
                        background: '#1a1a2e',
                        color: '#e2e8f0',
                        border: '1px solid rgba(255,255,255,0.06)',
                    }
                }} />

                {/* Header */}
                <header className="header">
                    <h1>✦ My Notes</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{
                            padding: '0.35rem 0.85rem',
                            borderRadius: '50px',
                            background: 'rgba(129, 140, 248, 0.08)',
                            border: '1px solid rgba(129, 140, 248, 0.15)',
                            color: '#818cf8',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                        }}>
                            {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
                        </span>
                        <button onClick={handleLogout} className="btn btn-danger" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                        }}>
                            <FaSignOutAlt style={{ fontSize: '0.8rem' }} />
                            Logout
                        </button>
                    </div>
                </header>

                {/* Main Layout: 2 Columns */}
                <div className="dashboard-layout">

                    {/* Left Column: Editor */}
                    <aside className="editor-section">
                        <form onSubmit={handleAddNote} className="note-form">
                            <h2 style={{
                                margin: '0 0 0.25rem 0',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <FaStickyNote style={{
                                    WebkitTextFillColor: '#818cf8',
                                    fontSize: '0.95rem'
                                }} />
                                New Note
                            </h2>
                            <p style={{
                                color: '#64748b',
                                fontSize: '0.82rem',
                                margin: '0 0 0.5rem 0'
                            }}>
                                Write something worth remembering
                            </p>
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="form-input"
                                required
                            />
                            <textarea
                                placeholder="Write your note here..."
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                className="form-textarea"
                                style={{ minHeight: '150px' }}
                                required
                            />
                            <button type="submit" className="btn btn-primary" style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.4rem'
                            }}>
                                <FaPlus style={{ fontSize: '0.8rem' }} />
                                Add Note
                            </button>
                        </form>
                    </aside>

                    {/* Right Column: Scrollable List */}
                    <main className="notes-section">
                        {/* Search Bar */}
                        <form onSubmit={handleSearch} style={{
                            marginBottom: '0.5rem',
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'stretch'
                        }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <FaSearch style={{
                                    position: 'absolute',
                                    left: '0.85rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#64748b',
                                    fontSize: '0.85rem'
                                }} />
                                <input
                                    type="text"
                                    placeholder="Search notes semantically..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="form-input"
                                    style={{ paddingLeft: '2.5rem', width: '100%' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={isSearching} style={{
                                whiteSpace: 'nowrap'
                            }}>
                                {isSearching ? (
                                    <>
                                        <span style={{
                                            display: 'inline-block',
                                            width: '14px',
                                            height: '14px',
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: 'white',
                                            borderRadius: '50%',
                                            animation: 'spin 0.6s linear infinite'
                                        }} />
                                        Thinking...
                                    </>
                                ) : (
                                    <>
                                        <FaSearch style={{ fontSize: '0.75rem' }} />
                                        AI Search
                                    </>
                                )}
                            </button>
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => { setSearchQuery(''); fetchNotes(); }}
                                >
                                    Clear
                                </button>
                            )}
                        </form>

                        {/* Notes List */}
                        {Array.isArray(notes) && notes.length > 0 ? (
                            notes.slice().reverse().map(note => (
                                <div key={note.id} className="note-card">
                                    <div>
                                        <h3 className="note-title">{note.title}</h3>
                                        <p className="note-content" style={{ whiteSpace: 'pre-wrap' }}>
                                            {note.content}
                                        </p>
                                    </div>

                                    <div className="note-footer">
                                        <small className="note-date">
                                            {new Date(note.createdAt).toLocaleDateString(undefined, {
                                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </small>
                                        <div className="note-actions">
                                            <button
                                                onClick={() => handleEdit(note)}
                                                className="icon-btn edit-btn"
                                                title="Edit Note"
                                            >
                                                <FaPencilAlt />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                className="icon-btn delete-btn"
                                                title="Delete Note"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                color: '#64748b',
                                marginTop: '6rem',
                                animation: 'fadeIn 0.5s ease'
                            }}>
                                <FaStickyNote style={{
                                    fontSize: '3rem',
                                    color: 'rgba(129, 140, 248, 0.2)',
                                    marginBottom: '1rem'
                                }} />
                                <p style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: '#94a3b8',
                                    marginBottom: '0.4rem'
                                }}>
                                    No notes yet
                                </p>
                                <p style={{ fontSize: '0.9rem' }}>
                                    Use the form on the left to create your first note!
                                </p>
                            </div>
                        )}
                    </main>
                </div>

                {/* Inline keyframes for spinner */}
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
}

export default Dashboard;