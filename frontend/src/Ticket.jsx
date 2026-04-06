import { useState } from 'react';
import { Ticket as TicketIcon, ShoppingCart, Pencil, Trash2, Check, X } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #EF4444 0%, #9B72CF 100%)';

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
            <div className="edit-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <TicketIcon size={16} color="#EF4444" />
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#E0E0FF' }}>Editing: {name}</span>
                </div>
                <div className="edit-fields">
                    <div className="edit-field" style={{ flex: 3 }}>
                        <label className="edit-label">Event / Description</label>
                        <input className="edit-input" value={tempName} onChange={e => setTempName(e.target.value)} placeholder="Event name" />
                    </div>
                    <div className="edit-field" style={{ minWidth: 100, flex: 'none' }}>
                        <label className="edit-label">Price ($)</label>
                        <input className="edit-input" type="number" value={tempPrice} onChange={e => setTempPrice(e.target.value)} step="0.01" />
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
                <TicketIcon size={40} color="rgba(255,255,255,0.9)" />
                <div className="p-cover-badge">
                    <span className="badge badge-primary">Event</span>
                </div>
            </div>
            <div className="p-info">
                <h3 className="p-title">{name}</h3>
                <p className="p-subtitle" style={{ color: '#64748B' }}>Event ticket</p>
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

export default Ticket;
