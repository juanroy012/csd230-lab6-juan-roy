import  { useState } from 'react';
import { BookOpen } from 'lucide-react';

function Book({ id, name, author, price, copies, onDelete, onUpdate, canManage = false, onAddToCart }) {
    // 1. Local state for "Edit Mode"
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);
    const [tempAuthor, setTempAuthor] = useState(author);
    const [tempPrice, setTempPrice] = useState(price);
    const [tempCopies, setTempCopies] = useState(copies);

    // 2. Handle Save
    const handleSave = () => {
        if (!canManage) return;

        const updatedBook = {
            id,
            name: tempName,
            author: tempAuthor,
            price: parseFloat(tempPrice),
            copies: parseInt(tempCopies),
        };

        onUpdate(id, updatedBook); // Call the parent function
        setIsEditing(false);       // Exit edit mode
    };

    // 3. Conditional Rendering: EDIT MODE
    if (isEditing && canManage) {
        return (
            <div className="book-row editing" style={{ border: '2px solid #4444ff', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#eef', flexWrap: 'wrap' }}>
                <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Name" style={{ flex: 2, minWidth: '120px' }} />
                <input type="text" value={tempAuthor} onChange={(e) => setTempAuthor(e.target.value)} placeholder="Author" style={{ flex: 1, minWidth: '100px' }} />
                <input type="number" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} placeholder="Price" style={{ width: '80px' }} />
                <input type="number" value={tempCopies} onChange={(e) => setTempCopies(e.target.value)} placeholder="Copies" style={{ width: '80px' }} />
                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white' }}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{ backgroundColor: '#6c757d', color: 'white' }}>Cancel</button>
            </div>
        );
    }

    // 4. Conditional Rendering: VIEW MODE
    return (
        <div className="book-row" style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f9f9' }}>
            <div className="book-info" style={{ textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 5px 0', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={18} />
                    {name}
                </h3>
                <p style={{ margin: '0' }}>
                    <strong>Author:</strong> {author} | <strong>Price:</strong> ${price?.toFixed(2)} | <strong>Copies:</strong> {copies}
                </p>
            </div>

            {canManage ? (
                <div className="book-actions">
                    <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#ffc107', marginRight: '5px' }}>Edit</button>
                    <button onClick={() => onDelete(id)} style={{ backgroundColor: '#ff4444', color: 'white', marginRight: '5px' }}>Delete</button>
                    {onAddToCart && <button onClick={() => onAddToCart(id)} style={{ backgroundColor: '#007bff', color: 'white' }}>Add to Cart</button>}
                </div>
            ) : (
                onAddToCart && <button onClick={() => onAddToCart(id)} style={{ backgroundColor: '#007bff', color: 'white' }}>Add to Cart</button>
            )}
        </div>
    );
}

export default Book;