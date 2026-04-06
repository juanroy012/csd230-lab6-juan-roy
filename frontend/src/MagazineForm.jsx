import { useState } from 'react';
import { Newspaper, Save } from 'lucide-react';

function MagazineForm({ onMagazineAdded }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [copies, setCopies] = useState('');
    const [orderQty, setOrderQty] = useState('');
    const [currentIssue, setCurrentIssue] = useState('');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        const payload = { name, price: parseFloat(price), copies: parseInt(copies), orderQty: parseInt(orderQty), currentIssue: currentIssue ? new Date(currentIssue).toISOString() : null };
        try {
            const res = await fetch('/api/rest/magazines', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const data = await res.text().then(t => { try { return JSON.parse(t); } catch { return null; } });
            if (res.ok && data) { setMsg('success'); onMagazineAdded(data); setName(''); setPrice(''); setCopies(''); setOrderQty(''); setCurrentIssue(''); }
            else { setMsg('error'); }
        } catch { setMsg('error'); } finally { setSaving(false); }
    };

    return (
        <div className="page-wrapper form-page">
            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-card-header">
                    <div className="form-card-icon" style={{ background: 'linear-gradient(135deg,#2DD4BF,#3D52A0)' }}>
                        <Newspaper size={22} color="#fff" />
                    </div>
                    <div>
                        <h2 className="form-card-title">Add New Magazine</h2>
                        <p className="form-card-subtitle">Add a magazine to the catalog</p>
                    </div>
                </div>
                {msg === 'success' && <div className="alert alert-success">Magazine saved!</div>}
                {msg === 'error' && <div className="alert alert-error">Failed to save. Try again.</div>}
                <div className="form-grid">
                    <div className="form-field form-grid-full">
                        <label className="form-label">Name</label>
                        <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Wired" />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Price ($)</label>
                        <input className="form-input" type="number" value={price} onChange={e => setPrice(e.target.value)} required step="0.01" min="0" placeholder="0.00" />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Copies</label>
                        <input className="form-input" type="number" value={copies} onChange={e => setCopies(e.target.value)} required min="1" placeholder="1" />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Order Qty</label>
                        <input className="form-input" type="number" value={orderQty} onChange={e => setOrderQty(e.target.value)} required min="1" placeholder="1" />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Current Issue Date</label>
                        <input className="form-input" type="datetime-local" value={currentIssue} onChange={e => setCurrentIssue(e.target.value)} />
                    </div>
                </div>
                <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={saving}>
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Magazine'}
                </button>
            </form>
        </div>
    );
}

export default MagazineForm;
