import { useState } from 'react';
import { Disc3, ShoppingCart, Pencil, Trash2, Check, X, CalendarDays, Hash, CheckCircle2, XCircle } from 'lucide-react';

const GRAD = 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)';

function DiscMag({ id, name, price, copies, orderQty, currentIssue, hasDisc, onDelete, onUpdate, canManage = false, onAddToCart }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);
    const [tempPrice, setTempPrice] = useState(price);
    const [tempCopies, setTempCopies] = useState(copies);
    const [tempOrderQty, setTempOrderQty] = useState(orderQty);
    const [tempCurrentIssue, setTempCurrentIssue] = useState(currentIssue ? currentIssue.slice(0, 16) : '');
    const [tempHasDisc, setTempHasDisc] = useState(hasDisc);

    const handleSave = () => {
        if (!canManage) return;
        onUpdate(id, { id, name: tempName, price: parseFloat(tempPrice), copies: parseInt(tempCopies), orderQty: parseInt(tempOrderQty), currentIssue: tempCurrentIssue ? new Date(tempCurrentIssue).toISOString() : null, hasDisc: tempHasDisc });
        setIsEditing(false);
    };

    const formatDate = (dt) => dt ? new Date(dt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';

    if (isEditing && canManage) {
        return (
            <div className="edit-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Disc3 size={16} color="#F59E0B" />
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#E0E0FF' }}>Editing: {name}</span>
                </div>
                <div className="edit-fields">
                    <div className="edit-field" style={{ flex: 3 }}>
                        <label className="edit-label">Name</label>
                        <input className="edit-input" value={tempName} onChange={e => setTempName(e.target.value)} />
                    </div>
                    <div className="edit-field" style={{ minWidth: 90, flex: 'none' }}>
                        <label className="edit-label">Price ($)</label>
                        <input className="edit-input" type="number" value={tempPrice} onChange={e => setTempPrice(e.target.value)} step="0.01" />
                    </div>
                    <div className="edit-field" style={{ minWidth: 80, flex: 'none' }}>
                        <label className="edit-label">Copies</label>
                        <input className="edit-input" type="number" value={tempCopies} onChange={e => setTempCopies(e.target.value)} />
                    </div>
                    <div className="edit-field" style={{ minWidth: 90, flex: 'none' }}>
                        <label className="edit-label">Order Qty</label>
                        <input className="edit-input" type="number" value={tempOrderQty} onChange={e => setTempOrderQty(e.target.value)} />
                    </div>
                    <div className="edit-field" style={{ flex: 2 }}>
                        <label className="edit-label">Issue Date</label>
                        <input className="edit-input" type="datetime-local" value={tempCurrentIssue} onChange={e => setTempCurrentIssue(e.target.value)} />
                    </div>
                    <div className="edit-field" style={{ minWidth: 110, flex: 'none', justifyContent: 'flex-end' }}>
                        <label className="edit-label">Has Disc</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                            <input type="checkbox" checked={tempHasDisc} onChange={e => setTempHasDisc(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#F59E0B', cursor: 'pointer' }} />
                            <span style={{ fontSize: '0.82rem', color: '#E0E0FF' }}>Includes Disc</span>
                        </label>
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
                <Disc3 size={40} color="rgba(255,255,255,0.9)" />
                <div className="p-cover-badge">
                    <span className={`badge ${copies > 0 ? 'badge-success' : 'badge-error'}`}>
                        {copies > 0 ? `${copies} in stock` : 'Out of stock'}
                    </span>
                </div>
            </div>
            <div className="p-info">
                <h3 className="p-title">{name}</h3>
                <div className="p-meta">
                    <span><Hash size={11} />{orderQty} ordered</span>
                    <span><CalendarDays size={11} />{formatDate(currentIssue)}</span>
                    <span>
                        {hasDisc
                            ? <><CheckCircle2 size={11} color="#2DD4BF" /> Disc</>
                            : <><XCircle size={11} color="#EF4444" /> No disc</>}
                    </span>
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

export default DiscMag;
