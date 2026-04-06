import { useState } from 'react';
import { BookOpen, Save } from 'lucide-react';

function BookForm({ onBookAdded }) {
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [copies, setCopies] = useState('');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); setMsg('');
        const newBook = { name, author, price: parseFloat(price), copies: parseInt(copies) };
        try {
            const res = await fetch('/api/rest/books', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newBook),
            });
            const data = await res.text().then(t => { try { return JSON.parse(t); } catch { return null; } });
            if (res.ok && data) {
                setMsg('success');
                onBookAdded(data);
                setName(''); setAuthor(''); setPrice(''); setCopies('');
            } else { setMsg('error'); }
        } catch { setMsg('error'); } finally { setSaving(false); }
    };

    return (
        <div className="page-wrapper form-page">
            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-card-header">
                    <div className="form-card-icon" style={{ background: 'linear-gradient(135deg,#3D52A0,#9B72CF)' }}>
                        <BookOpen size={22} color="#fff" />
                    </div>
                    <div>
                        <h2 className="form-card-title">Add New Book</h2>
                        <p className="form-card-subtitle">Fill in the details to add a book to the catalog</p>
                    </div>
                </div>

                {msg === 'success' && <div className="alert alert-success">Book saved successfully!</div>}
                {msg === 'error' && <div className="alert alert-error">Failed to save book. Try again.</div>}

                <div className="form-grid">
                    <div className="form-field form-grid-full">
                        <label className="form-label">Title</label>
                        <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Clean Code" />
                    </div>
                    <div className="form-field form-grid-full">
                        <label className="form-label">Author</label>
                        <input className="form-input" type="text" value={author} onChange={e => setAuthor(e.target.value)} required placeholder="e.g. Robert C. Martin" />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Price ($)</label>
                        <input className="form-input" type="number" value={price} onChange={e => setPrice(e.target.value)} required step="0.01" min="0" placeholder="0.00" />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Copies</label>
                        <input className="form-input" type="number" value={copies} onChange={e => setCopies(e.target.value)} required min="1" placeholder="1" />
                    </div>
                </div>
                <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={saving}>
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Book'}
                </button>
            </form>
        </div>
    );
}

export default BookForm;