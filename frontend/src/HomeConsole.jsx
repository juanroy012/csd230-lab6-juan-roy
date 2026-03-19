import React, { useState } from 'react';

function HomeConsole({ id, name, manufacturer, price, quantity, maxResolution, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);
    const [tempMfr, setTempMfr] = useState(manufacturer);
    const [tempPrice, setTempPrice] = useState(price);
    const [tempQty, setTempQty] = useState(quantity);
    const [tempRes, setTempRes] = useState(maxResolution);

    const handleSave = () => {
        onUpdate(id, {
            id,
            name: tempName,
            manufacturer: tempMfr,
            price: parseFloat(tempPrice),
            quantity: parseInt(tempQty),
            maxResolution: tempRes,
        });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div style={{ border: '2px solid #2980b9', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', gap: '10px', backgroundColor: '#f0f8ff', flexWrap: 'wrap' }}>
                <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Name" style={{ flex: 2, minWidth: '120px' }} />
                <input type="text" value={tempMfr} onChange={(e) => setTempMfr(e.target.value)} placeholder="Manufacturer" style={{ flex: 1, minWidth: '100px' }} />
                <input type="number" value={tempPrice} onChange={(e) => setTempPrice(e.target.value)} placeholder="Price" style={{ width: '80px' }} />
                <input type="number" value={tempQty} onChange={(e) => setTempQty(e.target.value)} placeholder="Quantity" style={{ width: '80px' }} />
                <input type="text" value={tempRes} onChange={(e) => setTempRes(e.target.value)} placeholder="Max Resolution" style={{ width: '110px' }} />
                <button onClick={handleSave} style={{ backgroundColor: '#28a745', color: 'white' }}>Save</button>
                <button onClick={() => setIsEditing(false)} style={{ backgroundColor: '#6c757d', color: 'white' }}>Cancel</button>
            </div>
        );
    }

    return (
        <div style={{ border: '1px solid #ccc', margin: '10px 0', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f8ff' }}>
            <div style={{ textAlign: 'left' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>🖥️ {name}</h3>
                <p style={{ margin: 0 }}>
                    <strong>Manufacturer:</strong> {manufacturer} |{' '}
                    <strong>Price:</strong> ${price?.toFixed(2)} |{' '}
                    <strong>Qty:</strong> {quantity} |{' '}
                    <strong>Max Resolution:</strong> {maxResolution}
                </p>
            </div>
            <div>
                <button onClick={() => setIsEditing(true)} style={{ backgroundColor: '#ffc107', marginRight: '5px' }}>Edit</button>
                <button onClick={() => onDelete(id)} style={{ backgroundColor: '#ff4444', color: 'white' }}>Delete</button>
            </div>
        </div>
    );
}

export default HomeConsole;
