import { useState } from 'react';
import { CircleCheckBig, CircleX, Disc3 } from 'lucide-react';

function DiscMag({ id, name, price, copies, orderQty, currentIssue, hasDisc, onDelete, onUpdate, canManage = false, onAddToCart }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);
    const [tempPrice, setTempPrice] = useState(price);
    const [tempCopies, setTempCopies] = useState(copies);
    const [tempOrderQty, setTempOrderQty] = useState(orderQty);
    const [tempCurrentIssue, setTempCurrentIssue] = useState(
        currentIssue ? currentIssue.slice(0, 16) : ''
    );
    const [tempHasDisc, setTempHasDisc] = useState(hasDisc);

    const handleSave = () => {
        if (!canManage) return;

        const updatedDiscMag = {
            id,
            name: tempName,
            price: parseFloat(tempPrice),
            copies: parseInt(tempCopies),
            orderQty: parseInt(tempOrderQty),
            currentIssue: tempCurrentIssue ? new Date(tempCurrentIssue).toISOString() : null,
            hasDisc: tempHasDisc,
        };
        onUpdate(id, updatedDiscMag);
        setIsEditing(false);
    };

    const formatDate = (dt) => {
        if (!dt) return 'N/A';
        return new Date(dt).toLocaleString();
    };

    if (isEditing && canManage) {
        return (
            <div style={{ border: '2px solid #e67e22', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#fff8f0', flexWrap: 'wrap' }}>
                <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Name" style={{ flex: 2, minWidth: '120px' }} />
                <input type="number" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} placeholder="Price" style={{ width: '80px' }} />
                <input type="number" value={tempCopies} onChange={(e) => setTempCopies(e.target.value)} placeholder="Copies" style={{ width: '80px' }} />
                <input type="number" value={tempOrderQty} onChange={(e) => setTempOrderQty(e.target.value)} placeholder="Order Qty" style={{ width: '90px' }} />
                <input type="datetime-local" value={tempCurrentIssue} onChange={(e) => setTempCurrentIssue(e.target.value)} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <input type="checkbox" checked={tempHasDisc} onChange={(e) => setTempHasDisc(e.target.checked)} />
                    Has Disc
                </label>
                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white' }}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{ backgroundColor: '#6c757d', color: 'white' }}>Cancel</button>
            </div>
        );
    }

    return (
        <div style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fffaf5' }}>
            <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 5px 0', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Disc3 size={18} />
                    {name}
                </h3>
                <p style={{ margin: '0' }}>
                    <strong>Price:</strong> ${price?.toFixed(2)} |{' '}
                    <strong>Copies:</strong> {copies} |{' '}
                    <strong>Order Qty:</strong> {orderQty} |{' '}
                    <strong>Current Issue:</strong> {formatDate(currentIssue)} |{' '}
                    <strong>Has Disc:</strong>{' '}
                    {hasDisc ? <CircleCheckBig size={16} color="#2e7d32" /> : <CircleX size={16} color="#c62828" />}
                </p>
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

export default DiscMag;

