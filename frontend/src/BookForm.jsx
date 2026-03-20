import { useState } from 'react';

const field = { display: 'inline-flex', flexDirection: 'column', marginRight: '10px', marginBottom: '10px' };
const lbl   = { fontSize: '0.72rem', fontWeight: '600', color: '#555', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.4px' };

function BookForm({ onBookAdded }) {
    const [name, setName] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [copies, setCopies] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBook = { name, author, price: parseFloat(price), copies: parseInt(copies) };
        fetch('/api/rest/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBook),
        })
            .then(async res => {
                const data = await res.text().then(t => { try { return JSON.parse(t); } catch { return null; } });
                if (res.ok && data) {
                    alert('Book Saved!');
                    onBookAdded(data);
                    setName(''); setAuthor(''); setPrice(''); setCopies('');
                } else {
                    alert(`Error saving book (${res.status})`);
                }
            });
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '2px solid #0066cc', padding: '20px', marginBottom: '20px', borderRadius: '8px', backgroundColor: '#f0f4ff' }}>
            <h3 style={{ marginTop: 0 }}>Add New Book</h3>
            <div style={field}><label style={lbl}>Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Clean Code" /></div>
            <div style={field}><label style={lbl}>Author</label><input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required placeholder="e.g. Robert C. Martin" /></div>
            <div style={field}><label style={lbl}>Price ($)</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" placeholder="0.00" style={{ width: '90px' }} /></div>
            <div style={field}><label style={lbl}>Copies</label><input type="number" value={copies} onChange={(e) => setCopies(e.target.value)} required placeholder="1" style={{ width: '80px' }} /></div>
            <br />
            <button type="submit" style={{ backgroundColor: '#0066cc', color: 'white', padding: '8px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save Book</button>
        </form>
    );
}

export default BookForm;