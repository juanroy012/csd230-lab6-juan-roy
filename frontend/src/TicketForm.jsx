import { useState } from 'react';
import { Ticket as TicketIcon, Save } from 'lucide-react';

function TicketForm({ onTicketAdded }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        try {
            const res = await fetch('/api/rest/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price: parseFloat(price) }),
            });
            const data = await res.text().then(t => { try { return JSON.parse(t); } catch { return null; } });
            if (res.ok && data) {
                setMsg('success'); onTicketAdded(data);
                setName(''); setPrice('');
            } else { setMsg('error'); }
        } catch { setMsg('error'); } finally { setSaving(false); }
    };

    return (
        <div className="page-wrapper form-page">
            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-card-header">
                    <div className="form-card-icon" style={{ background: 'linear-gradient(135deg,#EF4444,#9B72CF)' }}>
                        <TicketIcon size={22} color="#fff" />
                    </div>
                    <div>
                        <h2 className="form-card-title">Add New Ticket</h2>
                        <p className="form-card-subtitle">Add an event ticket to the catalog</p>
                    </div>
                </div>
                {msg === 'success' && <div className="alert alert-success">Ticket saved!</div>}
                {msg === 'error' && <div className="alert alert-error">Failed to save. Try again.</div>}
                <div className="form-grid">
                    <div className="form-field form-grid-full">
                        <label className="form-label">Event / Description</label>
                        <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Coldplay World Tour 2026" />
                    </div>
                    <div className="form-field form-grid-full">
                        <label className="form-label">Price ($)</label>
                        <input className="form-input" type="number" value={price} onChange={e => setPrice(e.target.value)} required step="0.01" min="0" placeholder="0.00" />
                    </div>
                </div>
                <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={saving}>
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Ticket'}
                </button>
            </form>
        </div>
    );
}

export default TicketForm;
