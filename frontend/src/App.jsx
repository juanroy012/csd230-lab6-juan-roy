import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Book from './Book';
import BookForm from './BookForm';
import Magazine from './Magazine';
import MagazineForm from './MagazineForm';
import Cart from './Cart';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { useAuth } from './provider/authProvider';
import api from './api/axiosConfig';
import './App.css';

function App() {
    const { token, isAdmin } = useAuth();
    const [books, setBooks] = useState([]);
    const [magazines, setMagazines] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [cartNotice, setCartNotice] = useState('');

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const loadInitialData = async () => {
            try {
                const [booksRes, magsRes, cartRes] = await Promise.all([
                    api.get('/books'),
                    api.get('/magazines'),
                    api.get('/cart')
                ]);
                setBooks(booksRes.data);
                setMagazines(magsRes.data);
                setCartCount(cartRes.data.products.length);
            } catch (err) {
                console.error('Failed to load data', err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [token]);

    useEffect(() => {
        if (!cartNotice) return;
        const timer = setTimeout(() => setCartNotice(''), 2200);
        return () => clearTimeout(timer);
    }, [cartNotice]);

    const handleAddToCart = async (productId) => {
        try {
            const res = await api.post(`/cart/add/${productId}`);
            setCartCount(res.data.products.length);
            setCartNotice('🛒 Added to cart');
        } catch (err) {
            setCartNotice('Could not add item to cart');
        }
    };

    const handleDeleteBook = async (id) => {
        if (!isAdmin) return;
        if (!window.confirm('Delete book?')) return;
        await api.delete(`/books/${id}`);
        setBooks(books.filter(b => b.id !== id));
    };

    const handleUpdateBook = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/books/${id}`, data);
        setBooks(books.map(b => b.id === id ? res.data : b));
    };

    const handleDeleteMagazine = async (id) => {
        if (!isAdmin) return;
        await api.delete(`/magazines/${id}`);
        setMagazines(magazines.filter(mag => mag.id !== id));
    };

    const handleUpdateMagazine = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/magazines/${id}`, data);
        setMagazines(magazines.map(mag => mag.id === id ? res.data : mag));
    };

    if (loading) return <h2>Loading Bookstore...</h2>;

    return (
        <div className="app-container">
            {token && <Navbar cartCount={cartCount} isAdmin={isAdmin} />}
            {cartNotice && (
                <p style={{ margin: '0 0 12px 0', color: '#0a7a35', fontWeight: 600 }}>{cartNotice}</p>
            )}

            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/inventory"
                        element={
                            <div className="book-list">
                                <h1>Books</h1>
                                {books.map(b => (
                                    <Book
                                        key={b.id}
                                        {...b}
                                        canManage={isAdmin}
                                        onDelete={handleDeleteBook}
                                        onUpdate={handleUpdateBook}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))}
                            </div>
                        }
                    />
                    <Route
                        path="/magazines"
                        element={
                            <div className="magazine-list">
                                <h1>Magazines</h1>
                                {magazines.map(m => (
                                    <Magazine
                                        key={m.id}
                                        {...m}
                                        canManage={isAdmin}
                                        onAddToCart={handleAddToCart}
                                        onDelete={handleDeleteMagazine}
                                        onUpdate={handleUpdateMagazine}
                                    />
                                ))}
                            </div>
                        }
                    />
                    <Route path="/cart" element={<Cart api={api} onCartChange={(count) => setCartCount(count)} />} />
                    <Route
                        path="/add"
                        element={isAdmin ? <BookForm onBookAdded={(b) => setBooks([...books, b])} api={api} /> : <Navigate to="/" replace />}
                    />
                    <Route
                        path="/add-magazine"
                        element={isAdmin ? <MagazineForm onMagazineAdded={(m) => setMagazines([...magazines, m])} api={api} /> : <Navigate to="/" replace />}
                    />
                    <Route path="/logout" element={<Logout />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
