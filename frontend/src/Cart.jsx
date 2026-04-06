import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, CreditCard, PackageOpen, BookOpen, ArrowRight } from 'lucide-react';

const ITEM_GRADS = [
    'linear-gradient(135deg,#3D52A0,#9B72CF)',
    'linear-gradient(135deg,#2DD4BF,#3D52A0)',
    'linear-gradient(135deg,#F59E0B,#EF4444)',
    'linear-gradient(135deg,#EF4444,#9B72CF)',
    'linear-gradient(135deg,#3D52A0,#48CAE4)',
];

function Cart({ api, onCartChange }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [busyId, setBusyId] = useState(null);
    const [checkingOut, setCheckingOut] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState('');

    const extractProducts = (payload) => {
        if (Array.isArray(payload?.products)) return payload.products;
        if (Array.isArray(payload)) return payload;
        return [];
    };

    const loadCart = useCallback(async () => {
        setError('');
        try {
            const response = await api.get('/cart');
            const items = extractProducts(response.data);
            setProducts(items);
            onCartChange?.(items.length);
        } catch {
            setError('Could not load your cart.');
        } finally {
            setLoading(false);
        }
    }, [api, onCartChange]);

    useEffect(() => { loadCart(); }, [loadCart]);

    const total = useMemo(() => products.reduce((sum, item) => sum + (Number(item?.price) || 0), 0), [products]);

    const handleRemove = async (productId) => {
        setBusyId(productId); setError('');
        try {
            await api.post(`/cart/remove/${productId}`);
            await loadCart();
        } catch {
            try {
                await api.delete(`/cart/${productId}`);
                await loadCart();
            } catch {
                setError('Unable to remove item from cart.');
            }
        } finally { setBusyId(null); }
    };

    const handleCheckout = async () => {
        setCheckingOut(true); setError(''); setCheckoutMessage('');
        try {
            await api.post('/cart/checkout');
            await loadCart();
            setCheckoutMessage('success');
        } catch {
            setError('Checkout failed. Please try again.');
        } finally { setCheckingOut(false); }
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner" />
                <p>Loading your cart…</p>
            </div>
        );
    }

    return (
        <div className="page-wrapper" style={{ maxWidth: 760 }}>
            {/* Header */}
            <div className="page-header">
                <div className="page-title">
                    <div className="page-title-icon" style={{ background: 'linear-gradient(135deg,#3D52A0,#9B72CF)' }}>
                        <ShoppingCart size={20} color="#fff" />
                    </div>
                    <h1>Shopping Cart</h1>
                </div>
                {products.length > 0 && (
                    <span className="badge badge-primary">{products.length} item{products.length !== 1 ? 's' : ''}</span>
                )}
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

            {checkoutMessage === 'success' && (
                <div className="alert alert-success" style={{ marginBottom: 16, flexDirection: 'column', gap: 8 }}>
                    <span style={{ fontWeight: 700 }}>Checkout complete! 🎉</span>
                    <Link to="/inventory" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'inherit', fontWeight: 600 }}>
                        Continue shopping <ArrowRight size={13} />
                    </Link>
                </div>
            )}

            {products.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">
                        <PackageOpen size={28} color="#64748B" />
                    </div>
                    <h3>Your cart is empty</h3>
                    <p>Browse the catalog and add some items to get started.</p>
                    <Link to="/" className="btn btn-primary" style={{ marginTop: 20 }}>
                        <BookOpen size={14} /> Go to Catalog
                    </Link>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {products.map((product, i) => (
                            <div key={product.id} className="cart-item">
                                <div className="cart-cover" style={{ background: ITEM_GRADS[i % ITEM_GRADS.length] }}>
                                    <ShoppingCart size={18} color="rgba(255,255,255,0.85)" />
                                </div>
                                <div className="cart-info">
                                    <div className="cart-name">{product.name || `Product #${product.id}`}</div>
                                    <div className="cart-sub">Item #{product.id}</div>
                                    <div className="cart-price">${Number(product.price || 0).toFixed(2)}</div>
                                </div>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRemove(product.id)}
                                    disabled={busyId === product.id || checkingOut}
                                >
                                    <Trash2 size={13} />
                                    {busyId === product.id ? 'Removing…' : 'Remove'}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <span style={{ color: 'var(--clr-text-2)', fontSize: '0.85rem' }}>Order Total</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--clr-primary-l)' }}>
                                ${total.toFixed(2)}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-3)', marginBottom: 16 }}>
                            {products.length} item{products.length !== 1 ? 's' : ''} · Free shipping
                        </div>
                        <button
                            className="btn btn-primary btn-full btn-lg"
                            onClick={handleCheckout}
                            disabled={checkingOut || products.length === 0}
                        >
                            <CreditCard size={16} />
                            {checkingOut ? 'Processing…' : 'Checkout Now'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
