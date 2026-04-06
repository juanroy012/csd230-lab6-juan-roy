import { useState } from 'react';
import { BookOpen, ShoppingCart, Pencil, Trash2, Check, X } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #3D52A0 0%, #9B72CF 100%)';

function Book({ id, name, author, price, copies, onDelete, onUpdate, canManage = false, onAddToCart }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);
    const [tempAuthor, setTempAuthor] = useState(author);
    const [tempPrice, setTempPrice] = useState(price);
    const [tempCopies, setTempCopies] = useState(copies);

    const handleSave = () => {
        if (!canManage) return;
        onUpdate(id, { id, name: tempName, author: tempAuthor, price: parseFloat(tempPrice), copies: parseInt(tempCopies) });
        setIsEditing(false);
    };

    if (isEditing && canManage) {
        return (
            <div className="edit-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <BookOpen size={16} color="#7091E6" />
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#E0E0FF' }}>Editing: {name}</span>
                </div>
                <div className="edit-fields">
                    <div className="edit-field" style={{ flex: 2 }}>
                        <label className="edit-label">Name</label>
                        <input className="edit-input" value={tempName} onChange={e => setTempName(e.target.value)} placeholder="Title" />
                    </div>
                    <div className="edit-field" style={{ flex: 2 }}>
                        <label className="edit-label">Author</label>
                        <input className="edit-input" value={tempAuthor} onChange={e => setTempAuthor(e.target.value)} placeholder="Author" />
                    </div>
                    <div className="edit-field" style={{ minWidth: 90, flex: 'none' }}>
                        <label className="edit-label">Price ($)</label>
                        <input className="edit-input" type="number" value={tempPrice} onChange={e => setTempPrice(e.target.value)} step="0.01" />
                    </div>
                    <div className="edit-field" style={{ minWidth: 80, flex: 'none' }}>
                        <label className="edit-label">Copies</label>
                        <input className="edit-input" type="number" value={tempCopies} onChange={e => setTempCopies(e.target.value)} />
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
                <BookOpen size={40} color="rgba(255,255,255,0.9)" />
                <div className="p-cover-badge">
                    <span className={`badge ${copies > 0 ? 'badge-success' : 'badge-error'}`}>
                        {copies > 0 ? `${copies} in stock` : 'Out of stock'}
                    </span>
                </div>
            </div>
            <div className="p-info">
                <h3 className="p-title">{name}</h3>
                <p className="p-subtitle">{author}</p>
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

export default Book;