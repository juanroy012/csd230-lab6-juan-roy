import { useState } from 'react';

const field = { display: 'inline-flex', flexDirection: 'column', marginRight: '10px', marginBottom: '10px' };
const lbl   = { fontSize: '0.72rem', fontWeight: '600', color: '#555', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.4px' };

function MagazineForm({ onMagazineAdded }) {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [copies, setCopies] = useState('');
    const [orderQty, setOrderQty] = useState('');
    const [currentIssue, setCurrentIssue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMagazine = {
            name,
            price: parseFloat(price),
            copies: parseInt(copies),
            orderQty: parseInt(orderQty),
            currentIssue: currentIssue ? new Date(currentIssue).toISOString() : null,
        };
        fetch('/api/rest/magazines', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMagazine),
        })
            .then(async res => {
                const data = await res.text().then(t => { try { return JSON.parse(t); } catch { return null; } });
                if (res.ok && data) {
                    alert('Magazine Saved!');
                    onMagazineAdded(data);
                    setName(''); setPrice(''); setCopies(''); setOrderQty(''); setCurrentIssue('');
                } else {
                    alert(`Error saving magazine (${res.status})`);
                }
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid #9b59b6', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#fdf5ff' }}>
            <h3 style={{ marginTop: 0 }}>Add New Magazine</h3>
            <div style={field}><label style={lbl}>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Wired" /></div>
            <div style={field}><label style={lbl}>Price ($)</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" placeholder="0.00" style={{ width: '90px' }} /></div>
            <div style={field}><label style={lbl}>Copies</label><input type="number" value={copies} onChange={(e) => setCopies(e.target.value)} required placeholder="1" style={{ width: '80px' }} /></div>
            <div style={field}><label style={lbl}>Order Qty</label><input type="number" value={orderQty} onChange={(e) => setOrderQty(e.target.value)} required placeholder="1" style={{ width: '90px' }} /></div>
            <div style={field}><label style={lbl}>Current Issue Date</label><input type="datetime-local" value={currentIssue} onChange={(e) => setCurrentIssue(e.target.value)} /></div>
            <br />
            <button type="submit" style={{ backgroundColor: '#9b59b6', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>💾 Save Magazine</button>
        </form>
    );
}

export default MagazineForm;
