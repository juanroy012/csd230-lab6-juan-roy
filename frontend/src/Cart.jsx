import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

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
        } catch (err) {
            setError('Could not load your cart.');
        } finally {
            setLoading(false);
        }
    }, [api, onCartChange]);

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const total = useMemo(() => {
        return products.reduce((sum, item) => sum + (Number(item?.price) || 0), 0);
    }, [products]);

    const handleRemove = async (productId) => {
        setBusyId(productId);
        setError('');

        try {
            await api.post(`/cart/remove/${productId}`);
            await loadCart();
        } catch (firstError) {
            try {
                await api.delete(`/cart/${productId}`);
                await loadCart();
            } catch (secondError) {
                setError('Unable to remove item from cart.');
            }
        } finally {
            setBusyId(null);
        }
    };

    const handleCheckout = async () => {
        setCheckingOut(true);
        setError('');
        setCheckoutMessage('');

        try {
            await api.post('/cart/checkout');
            await loadCart();
            setCheckoutMessage('Checkout complete.');
        } catch (err) {
            setError('Checkout failed.');
        } finally {
            setCheckingOut(false);
        }
    };

    if (loading) {
        return <h2>Loading cart...</h2>;
    }

    return (
        <div className="cart-page" style={{ textAlign: 'left' }}>
            <h1>Shopping Cart</h1>

            {error && (
                <p style={{ color: '#b00020', fontWeight: 600 }}>{error}</p>
            )}
            {checkoutMessage && (
                <div style={{ marginBottom: '12px' }}>
                    <p style={{ color: '#0a7a35', fontWeight: 600, margin: '0 0 8px 0' }}>{checkoutMessage}</p>
                    <Link to="/inventory" style={{ color: '#1f4fd8', fontWeight: 600, textDecoration: 'none' }}>
                        Continue shopping
                    </Link>
                </div>
            )}

            {products.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {products.map((product) => (
                        <div
                            key={product.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                margin: '10px 0',
                                padding: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                backgroundColor: '#fafafa',
                            }}
                        >
                            <div>
                                <h3 style={{ margin: '0 0 4px 0' }}>{product.name || `Product #${product.id}`}</h3>
                                <p style={{ margin: 0 }}>
                                    <strong>Price:</strong> ${Number(product.price || 0).toFixed(2)}
                                </p>
                            </div>

                            <button
                                onClick={() => handleRemove(product.id)}
                                disabled={busyId === product.id || checkingOut}
                                style={{ backgroundColor: '#ff4444', color: 'white' }}
                            >
                                {busyId === product.id ? 'Removing...' : 'Remove'}
                            </button>
                        </div>
                    ))}

                    <div style={{ marginTop: '18px', borderTop: '1px solid #ddd', paddingTop: '12px' }}>
                        <h2 style={{ margin: '0 0 12px 0' }}>Total: ${total.toFixed(2)}</h2>
                        <button
                            onClick={handleCheckout}
                            disabled={checkingOut || products.length === 0}
                            style={{ backgroundColor: '#28a745', color: 'white' }}
                        >
                            {checkingOut ? 'Processing...' : 'Checkout'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
