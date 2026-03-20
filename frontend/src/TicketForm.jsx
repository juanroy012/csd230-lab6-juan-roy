import { useState } from 'react';

const field = { display: 'inline-flex', flexDirection: 'column', marginRight: '10px', marginBottom: '10px' };
const lbl   = { fontSize: '0.72rem', fontWeight: '600', color: '#555', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.4px' };

function TicketForm({ onTicketAdded }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/rest/tickets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price: parseFloat(price) }),
        })
            .then(async res => {
                const data = await res.text().then(t => { try { return JSON.parse(t); } catch { return null; } });
                if (res.ok && data) {
                    alert('Ticket Saved!');
                    onTicketAdded(data);
                    setName(''); setPrice('');
                } else {
                    alert(`Error saving ticket (${res.status})`);
                }
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid #e74c3c', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#fff5f5' }}>
            <h3 style={{ marginTop: 0 }}>Add New Ticket</h3>
            <div style={field}><label style={lbl}>Event / Description</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Coldplay World Tour 2026" style={{ minWidth: '220px' }} /></div>
            <div style={field}><label style={lbl}>Price ($)</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" placeholder="0.00" style={{ width: '100px' }} /></div>
            <br />
            <button type="submit" style={{ backgroundColor: '#e74c3c', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>💾 Save Ticket</button>
        </form>
    );
}

export default TicketForm;
