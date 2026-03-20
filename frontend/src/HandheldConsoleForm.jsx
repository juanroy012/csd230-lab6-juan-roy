import { useState } from 'react';

const field = { display: 'inline-flex', flexDirection: 'column', marginRight: '10px', marginBottom: '10px' };
const lbl   = { fontSize: '0.72rem', fontWeight: '600', color: '#555', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.4px' };

function HandheldConsoleForm({ onAdded }) {
    const [name, setName] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [batteryLifeHours, setBatteryLifeHours] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/api/rest/handheld-consoles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                manufacturer,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                batteryLifeHours: parseInt(batteryLifeHours),
            }),
        })
            .then(async res => {
                const data = await res.text().then(t => { try { return JSON.parse(t); } catch { return null; } });
                if (res.ok && data) {
                    alert('Handheld Console Saved!');
                    onAdded(data);
                    setName(''); setManufacturer(''); setPrice(''); setQuantity(''); setBatteryLifeHours('');
                } else {
                    alert(`Error saving handheld console (${res.status})`);
                }
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid #27ae60', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#f0fff4' }}>
            <h3 style={{ marginTop: 0 }}>Add New Handheld Console</h3>
            <div style={field}><label style={lbl}>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Nintendo Switch 2" /></div>
            <div style={field}><label style={lbl}>Manufacturer</label><input type="text" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} required placeholder="e.g. Nintendo" /></div>
            <div style={field}><label style={lbl}>Price ($)</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" placeholder="0.00" style={{ width: '90px' }} /></div>
            <div style={field}><label style={lbl}>Quantity</label><input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required placeholder="1" style={{ width: '80px' }} /></div>
            <div style={field}><label style={lbl}>Battery Life (hrs)</label><input type="number" value={batteryLifeHours} onChange={(e) => setBatteryLifeHours(e.target.value)} required placeholder="8" style={{ width: '100px' }} /></div>
            <br />
            <button type="submit" style={{ backgroundColor: '#27ae60', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save Handheld Console</button>
        </form>
    );
}

export default HandheldConsoleForm;
