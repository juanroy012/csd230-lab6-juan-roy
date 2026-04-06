import { useState } from 'react';
import { Gamepad2, Save } from 'lucide-react';

function HandheldConsoleForm({ onAdded }) {
    const [name, setName] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [batteryLifeHours, setBatteryLifeHours] = useState('');
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setMsg('');
        try {
            const res = await fetch('/api/rest/handheld-consoles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, manufacturer, price: parseFloat(price), quantity: parseInt(quantity), batteryLifeHours: parseInt(batteryLifeHours) }),
            });
            const data = await res.text().then(t => { try { return JSON.parse(t); } catch { return null; } });
            if (res.ok && data) {
                setMsg('success'); onAdded(data);
                setName(''); setManufacturer(''); setPrice(''); setQuantity(''); setBatteryLifeHours('');
            } else { setMsg('error'); }
        } catch { setMsg('error'); } finally { setSaving(false); }
    };

    return (
        <div className="page-wrapper form-page">
            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-card-header">
                    <div className="form-card-icon" style={{ background: 'linear-gradient(135deg,#2DD4BF,#48CAE4)' }}>
                        <Gamepad2 size={22} color="#fff" />
                    </div>
                    <div>
                        <h2 className="form-card-title">Add Handheld Console</h2>
                        <p className="form-card-subtitle">Add a portable gaming device to the catalog</p>
                    </div>
                </div>
                {msg === 'success' && <div className="alert alert-success">Handheld Console saved!</div>}
                {msg === 'error' && <div className="alert alert-error">Failed to save. Try again.</div>}
                <div className="form-grid">
                    <div className="form-field form-grid-full">
                        <label className="form-label">Name</label>
                        <input className="form-input" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Nintendo Switch 2" />
                    </div>
                    <div className="form-field form-grid-full">
                        <label className="form-label">Manufacturer</label>
                        <input className="form-input" type="text" value={manufacturer} onChange={e => setManufacturer(e.target.value)} required placeholder="e.g. Nintendo" />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Price ($)</label>
                        <input className="form-input" type="number" value={price} onChange={e => setPrice(e.target.value)} required step="0.01" min="0" placeholder="0.00" />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Quantity</label>
                        <input className="form-input" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required min="1" placeholder="1" />
                    </div>
                    <div className="form-field form-grid-full">
                        <label className="form-label">Battery Life (hours)</label>
                        <input className="form-input" type="number" value={batteryLifeHours} onChange={e => setBatteryLifeHours(e.target.value)} required min="1" placeholder="8" />
                    </div>
                </div>
                <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={saving}>
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Handheld Console'}
                </button>
            </form>
        </div>
    );
}

export default HandheldConsoleForm;
