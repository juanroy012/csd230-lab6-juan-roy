import { useState } from 'react';

const field = { display: 'inline-flex', flexDirection: 'column', marginRight: '10px', marginBottom: '10px' };
const lbl   = { fontSize: '0.72rem', fontWeight: '600', color: '#555', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.4px' };

function HomeConsoleForm({ onAdded }) {
    const [name, setName] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [maxResolution, setMaxResolution] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/rest/home-consoles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                manufacturer,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                maxResolution,
            }),
        })
            .then(async res => {
                const data = await res.text().then(t => { try { return JSON.parse(t); } catch { return null; } });
                if (res.ok && data) {
                    alert('Home Console Saved!');
                    onAdded(data);
                    setName(''); setManufacturer(''); setPrice(''); setQuantity(''); setMaxResolution('');
                } else {
                    alert(`Error saving home console (${res.status})`);
                }
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid #2980b9', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#f0f8ff' }}>
            <h3 style={{ marginTop: 0 }}>Add New Home Console</h3>
            <div style={field}><label style={lbl}>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. PlayStation 5 Pro" /></div>
            <div style={field}><label style={lbl}>Manufacturer</label><input type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} required placeholder="e.g. Sony" /></div>
            <div style={field}><label style={lbl}>Price ($)</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" placeholder="0.00" style={{ width: '90px' }} /></div>
            <div style={field}><label style={lbl}>Quantity</label><input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required placeholder="1" style={{ width: '80px' }} /></div>
            <div style={field}><label style={lbl}>Max Resolution</label><input type="text" value={maxResolution} onChange={(e) => setMaxResolution(e.target.value)} required placeholder="e.g. 4K" style={{ width: '100px' }} /></div>
            <br />
            <button type="submit" style={{ backgroundColor: '#2980b9', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>💾 Save Home Console</button>
        </form>
    );
}

export default HomeConsoleForm;
