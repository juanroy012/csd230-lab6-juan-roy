import { useState } from 'react';
import { Gamepad2, ShoppingCart, Pencil, Trash2, Check, X, Factory, BatteryFull } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #2DD4BF 0%, #48CAE4 100%)';

function HandheldConsole({ id, name, manufacturer, price, quantity, batteryLifeHours, onDelete, onUpdate, canManage = false, onAddToCart }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);
    const [tempMfr, setTempMfr] = useState(manufacturer);
    const [tempPrice, setTempPrice] = useState(price);
    const [tempQty, setTempQty] = useState(quantity);
    const [tempBattery, setTempBattery] = useState(batteryLifeHours);

    const handleSave = () => {
        if (!canManage) return;
        onUpdate(id, { id, name: tempName, manufacturer: tempMfr, price: parseFloat(tempPrice), quantity: parseInt(tempQty), batteryLifeHours: parseInt(tempBattery) });
        setIsEditing(false);
    };

    if (isEditing && canManage) {
        return (
            <div className="edit-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Gamepad2 size={16} color="#2DD4BF" />
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#E0E0FF' }}>Editing: {name}</span>
                </div>
                <div className="edit-fields">
                    <div className="edit-field" style={{ flex: 2 }}>
                        <label className="edit-label">Name</label>
                        <input className="edit-input" value={tempName} onChange={e => setTempName(e.target.value)} />
                    </div>
                    <div className="edit-field" style={{ flex: 2 }}>
                        <label className="edit-label">Manufacturer</label>
                        <input className="edit-input" value={tempMfr} onChange={e => setTempMfr(e.target.value)} />
                    </div>
                    <div className="edit-field" style={{ minWidth: 90, flex: 'none' }}>
                        <label className="edit-label">Price ($)</label>
                        <input className="edit-input" type="number" value={tempPrice} onChange={e => setTempPrice(e.target.value)} step="0.01" />
                    </div>
                    <div className="edit-field" style={{ minWidth: 80, flex: 'none' }}>
                        <label className="edit-label">Quantity</label>
                        <input className="edit-input" type="number" value={tempQty} onChange={e => setTempQty(e.target.value)} />
                    </div>
                    <div className="edit-field" style={{ minWidth: 100, flex: 'none' }}>
                        <label className="edit-label">Battery (hrs)</label>
                        <input className="edit-input" type="number" value={tempBattery} onChange={e => setTempBattery(e.target.value)} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-success btn-sm" onClick={handleSave}><Check size={13} /> Save</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setIsEditing(false)}><X size={13} /> Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-card">
            <div className="p-cover" style={{ background: GRAD }}>
                <Gamepad2 size={40} color="rgba(255,255,255,0.9)" />
                <div className="p-cover-badge">
                    <span className={`badge ${quantity > 0 ? 'badge-success' : 'badge-error'}`}>
                        {quantity > 0 ? `${quantity} in stock` : 'Out of stock'}
                    </span>
                </div>
            </div>
            <div className="p-info">
                <h3 className="p-title">{name}</h3>
                <div className="p-meta">
                    <span><Factory size={11} />{manufacturer}</span>
                    <span><BatteryFull size={11} />{batteryLifeHours}h battery</span>
                </div>
                <div className="p-footer">
                    <span className="p-price">${price?.toFixed(2)}</span>
                    {onAddToCart && (
                        <button className="btn btn-primary btn-sm" onClick={() => onAddToCart(id)}>
                            <ShoppingCart size={13} /> Add
                        </button>
                    )}
                </div>
                {canManage && (
                    <div className="p-actions">
                        <button className="btn btn-warning btn-sm" onClick={() => setIsEditing(true)}><Pencil size={12} /> Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => onDelete(id)}><Trash2 size={12} /> Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HandheldConsole;
