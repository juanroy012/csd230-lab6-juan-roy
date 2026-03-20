import { useState } from 'react';

function HandheldConsole({ id, name, manufacturer, price, quantity, batteryLifeHours, onDelete, onUpdate, canManage = false, onAddToCart }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);
    const [tempMfr, setTempMfr] = useState(manufacturer);
    const [tempPrice, setTempPrice] = useState(price);
    const [tempQty, setTempQty] = useState(quantity);
    const [tempBattery, setTempBattery] = useState(batteryLifeHours);

    const handleSave = () => {
        if (!canManage) return;

        onUpdate(id, {
            id,
            name: tempName,
            manufacturer: tempMfr,
            price: parseFloat(tempPrice),
            quantity: parseInt(tempQty),
            batteryLifeHours: parseInt(tempBattery),
        });
        setIsEditing(false);
    };

    if (isEditing && canManage) {
        return (
            <div style={{ border: '2px solid #27ae60', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#f0fff4', flexWrap: 'wrap' }}>
                <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Name" style={{ flex: 2, minWidth: '120px' }} />
                <input type="text" value={tempMfr} onChange={(e) => setTempMfr(e.target.value)} placeholder="Manufacturer" style={{ flex: 1, minWidth: '100px' }} />
                <input type="number" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} placeholder="Price" style={{ width: '80px' }} />
                <input type="number" value={tempQty} onChange={(e) => setTempQty(e.target.value)} placeholder="Quantity" style={{ width: '80px' }} />
                <input type="number" value={tempBattery} onChange={(e) => setTempBattery(e.target.value)} placeholder="Battery (hrs)" style={{ width: '100px' }} />
                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white' }}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{ backgroundColor: '#6c757d', color: 'white' }}>Cancel</button>
            </div>
        );
    }

    return (
        <div style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0fff4' }}>
            <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>🎮 {name}</h3>
                <p style={{ margin: 0 }}>
                    <strong>Manufacturer:</strong> {manufacturer} |{' '}
                    <strong>Price:</strong> ${price?.toFixed(2)} |{' '}
                    <strong>Qty:</strong> {quantity} |{' '}
                    <strong>Battery:</strong> {batteryLifeHours}h
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

export default HandheldConsole;
