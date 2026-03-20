import { useState } from 'react';

const field = { display: 'inline-flex', flexDirection: 'column', marginRight: '10px', marginBottom: '10px' };
const lbl   = { fontSize: '0.72rem', fontWeight: '600', color: '#555', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.4px' };

function DiscMagForm({ onDiscMagAdded }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [copies, setCopies] = useState('');
    const [orderQty, setOrderQty] = useState('');
    const [currentIssue, setCurrentIssue] = useState('');
    const [hasDisc, setHasDisc] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newDiscMag = {
            name,
            price: parseFloat(price),
            copies: parseInt(copies),
            orderQty: parseInt(orderQty),
            currentIssue: currentIssue ? new Date(currentIssue).toISOString() : null,
            hasDisc,
        };
        fetch('/api/rest/discmags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDiscMag),
        })
            .then(async res => {
                const data = await res.text().then(t => { try { return JSON.parse(t); } catch { return null; } });
                if (res.ok && data) {
                    alert('Disc Magazine Saved!');
                    onDiscMagAdded(data);
                    setName(''); setPrice(''); setCopies(''); setOrderQty(''); setCurrentIssue(''); setHasDisc(false);
                } else {
                    alert(`Error saving disc magazine (${res.status})`);
                }
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid #e67e22', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#fff8f0' }}>
            <h3 style={{ marginTop: 0 }}>Add New Disc Magazine</h3>
            <div style={field}><label style={lbl}>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. PC Gamer" /></div>
            <div style={field}><label style={lbl}>Price ($)</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" placeholder="0.00" style={{ width: '90px' }} /></div>
            <div style={field}><label style={lbl}>Copies</label><input type="number" value={copies} onChange={(e) => setCopies(e.target.value)} required placeholder="1" style={{ width: '80px' }} /></div>
            <div style={field}><label style={lbl}>Order Qty</label><input type="number" value={orderQty} onChange={(e) => setOrderQty(e.target.value)} required placeholder="1" style={{ width: '90px' }} /></div>
            <div style={field}><label style={lbl}>Current Issue Date</label><input type="datetime-local" value={currentIssue} onChange={(e) => setCurrentIssue(e.target.value)} /></div>
            <div style={{ ...field, flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="hasDisc" checked={hasDisc} onChange={(e) => setHasDisc(e.target.checked)} />
                <label htmlFor="hasDisc" style={{ ...lbl, marginBottom: 0 }}>Includes Disc</label>
            </div>
            <br />
            <button type="submit" style={{ backgroundColor: '#e67e22', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save Disc Magazine</button>
        </form>
    );
}

export default DiscMagForm;
