import { useState } from 'react';
import { Disc3, Save } from 'lucide-react';

function DiscMagForm({ onDiscMagAdded }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [copies, setCopies] = useState('');
    const [orderQty, setOrderQty] = useState('');
    const [currentIssue, setCurrentIssue] = useState('');
    const [hasDisc, setHasDisc] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        const payload = { name, price: parseFloat(price), copies: parseInt(copies), orderQty: parseInt(orderQty), currentIssue: currentIssue ? new Date(currentIssue).toISOString() : null, hasDisc };
        try {
            const res = await fetch('/api/rest/discmags', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const data = await res.text().then(t => { try { return JSON.parse(t); } catch { return null; } });
            if (res.ok && data) { setMsg('success'); onDiscMagAdded(data); setName(''); setPrice(''); setCopies(''); setOrderQty(''); setCurrentIssue(''); setHasDisc(false); }
            else { setMsg('error'); }
        } catch { setMsg('error'); } finally { setSaving(false); }
    };

    return (
        <div className="page-wrapper form-page">
            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-card-header">
                    <div className="form-card-icon" style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}>
                        <Disc3 size={22} color="#fff" />
                    </div>
                    <div>
                        <h2 className="form-card-title">Add New Disc Magazine</h2>
                        <p className="form-card-subtitle">Add a disc magazine to the catalog</p>
                    </div>
                </div>
                {msg === 'success' && <div className="alert alert-success">Disc Magazine saved!</div>}
                {msg === 'error' && <div className="alert alert-error">Failed to save. Try again.</div>}
                <div className="form-grid">
                    <div className="form-field form-grid-full">
                        <label className="form-label">Name</label>
                        <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. PC Gamer" />
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
                    <div className="form-field form-grid-full">
                        <label className="form-label">Disc Option</label>
                        <label className="form-checkbox-row">
                            <input type="checkbox" checked={hasDisc} onChange={e => setHasDisc(e.target.checked)} />
                            <span style={{ fontSize: '0.86rem', color: '#E0E0FF' }}>This magazine includes a disc</span>
                        </label>
                    </div>
                </div>
                <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={saving}>
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Disc Magazine'}
                </button>
            </form>
        </div>
    );
}

export default DiscMagForm;
