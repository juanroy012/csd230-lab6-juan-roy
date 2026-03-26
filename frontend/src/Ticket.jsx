import { useState } from 'react';
import { Ticket as TicketIcon } from 'lucide-react';

function Ticket({ id, name, price, onDelete, onUpdate, canManage = false, onAddToCart }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);
    const [tempPrice, setTempPrice] = useState(price);

    const handleSave = () => {
        if (!canManage) return;

        onUpdate(id, { id, name: tempName, price: parseFloat(tempPrice) });
        setIsEditing(false);
    };

    if (isEditing && canManage) {
        return (
            <div style={{ border: '2px solid #e74c3c', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#fff5f5', flexWrap: 'wrap' }}>
                <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Name" style={{ flex: 2, minWidth: '120px' }} />
                <input type="number" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} placeholder="Price" style={{ width: '90px' }} />
                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white' }}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{ backgroundColor: '#6c757d', color: 'white' }}>Cancel</button>
            </div>
        );
    }

    return (
        <div style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff5f5' }}>
            <div>
                <h3 style={{ margin: '0 0 5px 0', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <TicketIcon size={18} />
                    {name}
                </h3>
                <p style={{ margin: 0 }}><strong>Price:</strong> ${price?.toFixed(2)}</p>
            </div>
            {canManage ? (
                <div>
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

export default Ticket;
