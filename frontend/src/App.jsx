import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import Navbar from './Navbar';
import Home from './Home';
import Book from './Book';
import BookForm from './BookForm';
import Magazine from './Magazine';
import MagazineForm from './MagazineForm';
import DiscMag from './DiscMag';
import DiscMagForm from './DiscMagForm';
import HandheldConsole from './HandheldConsole';
import HandheldConsoleForm from './HandheldConsoleForm';
import HomeConsole from './HomeConsole';
import HomeConsoleForm from './HomeConsoleForm';
import Ticket from './Ticket';
import TicketForm from './TicketForm';
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
    const [discMags, setDiscMags] = useState([]);
    const [handheldConsoles, setHandheldConsoles] = useState([]);
    const [homeConsoles, setHomeConsoles] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        const loadInitialData = async () => {
            try {
                const [booksRes, magsRes, discMagsRes, handheldRes, homeRes, ticketsRes, cartRes] = await Promise.all([
                    api.get('/books'),
                    api.get('/magazines'),
                    api.get('/discmags'),
                    api.get('/handheld-consoles'),
                    api.get('/home-consoles'),
                    api.get('/tickets'),
                    api.get('/cart')
                ]);
                setBooks(booksRes.data);
                setMagazines(magsRes.data);
                setDiscMags(discMagsRes.data);
                setHandheldConsoles(handheldRes.data);
                setHomeConsoles(homeRes.data);
                setTickets(ticketsRes.data);
                setCartCount(cartRes.data.products.length);
            } catch (err) {
                console.error('Failed to load data', err);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, [token]);

    const handleAddToCart = async (productId) => {
        try {
            const res = await api.post(`/cart/add/${productId}`);
            setCartCount(res.data.products.length);
            alert('Added to cart!');
        } catch (err) {
            alert('Error adding to cart');
        }
    };

    const handleDeleteBook = async (id) => {
        if (!isAdmin || !window.confirm('Delete book?')) return;
        await api.delete(`/books/${id}`);
        setBooks(books.filter(b => b.id !== id));
    };

    const handleUpdateBook = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/books/${id}`, data);
        setBooks(books.map(b => b.id === id ? res.data : b));
    };

    const handleDeleteMagazine = async (id) => {
        if (!isAdmin || !window.confirm('Delete magazine?')) return;
        await api.delete(`/magazines/${id}`);
        setMagazines(magazines.filter(m => m.id !== id));
    };

    const handleUpdateMagazine = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/magazines/${id}`, data);
        setMagazines(magazines.map(m => m.id === id ? res.data : m));
    };

    const handleDeleteDiscMag = async (id) => {
        if (!isAdmin || !window.confirm('Delete disc magazine?')) return;
        await api.delete(`/discmags/${id}`);
        setDiscMags(discMags.filter(m => m.id !== id));
    };

    const handleUpdateDiscMag = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/discmags/${id}`, data);
        setDiscMags(discMags.map(m => m.id === id ? res.data : m));
    };

    const handleDeleteHandheld = async (id) => {
        if (!isAdmin || !window.confirm('Delete handheld console?')) return;
        await api.delete(`/handheld-consoles/${id}`);
        setHandheldConsoles(handheldConsoles.filter(c => c.id !== id));
    };

    const handleUpdateHandheld = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/handheld-consoles/${id}`, data);
        setHandheldConsoles(handheldConsoles.map(c => c.id === id ? res.data : c));
    };

    const handleDeleteHomeConsole = async (id) => {
        if (!isAdmin || !window.confirm('Delete home console?')) return;
        await api.delete(`/home-consoles/${id}`);
        setHomeConsoles(homeConsoles.filter(c => c.id !== id));
    };

    const handleUpdateHomeConsole = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/home-consoles/${id}`, data);
        setHomeConsoles(homeConsoles.map(c => c.id === id ? res.data : c));
    };

    const handleDeleteTicket = async (id) => {
        if (!isAdmin || !window.confirm('Delete ticket?')) return;
        await api.delete(`/tickets/${id}`);
        setTickets(tickets.filter(t => t.id !== id));
    };

    const handleUpdateTicket = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/tickets/${id}`, data);
        setTickets(tickets.map(t => t.id === id ? res.data : t));
    };

    if (loading) return <h2>Loading Bookstore...</h2>;

    return (
        <div className="app-container">
            {token && <Navbar cartCount={cartCount} isAdmin={isAdmin} />}

            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/inventory" element={<div className="book-list"><h1>Books</h1>{books.map(b => <Book key={b.id} {...b} canManage={isAdmin} onDelete={handleDeleteBook} onUpdate={handleUpdateBook} onAddToCart={handleAddToCart} />)}</div>} />
                    <Route path="/magazines" element={<div className="magazine-list"><h1>Magazines</h1>{magazines.map(m => <Magazine key={m.id} {...m} canManage={isAdmin} onDelete={handleDeleteMagazine} onUpdate={handleUpdateMagazine} onAddToCart={handleAddToCart} />)}</div>} />
                    <Route path="/discmags" element={<div className="discmag-list"><h1>Disc Magazines</h1>{discMags.map(m => <DiscMag key={m.id} {...m} canManage={isAdmin} onDelete={handleDeleteDiscMag} onUpdate={handleUpdateDiscMag} onAddToCart={handleAddToCart} />)}</div>} />
                    <Route path="/handheld-consoles" element={<div className="handheld-list"><h1>Handheld Consoles</h1>{handheldConsoles.map(c => <HandheldConsole key={c.id} {...c} canManage={isAdmin} onDelete={handleDeleteHandheld} onUpdate={handleUpdateHandheld} onAddToCart={handleAddToCart} />)}</div>} />
                    <Route path="/home-consoles" element={<div className="home-console-list"><h1>Home Consoles</h1>{homeConsoles.map(c => <HomeConsole key={c.id} {...c} canManage={isAdmin} onDelete={handleDeleteHomeConsole} onUpdate={handleUpdateHomeConsole} onAddToCart={handleAddToCart} />)}</div>} />
                    <Route path="/tickets" element={<div className="ticket-list"><h1>Tickets</h1>{tickets.map(t => <Ticket key={t.id} {...t} canManage={isAdmin} onDelete={handleDeleteTicket} onUpdate={handleUpdateTicket} onAddToCart={handleAddToCart} />)}</div>} />
                    <Route path="/cart" element={<Cart api={api} onCartChange={(count) => setCartCount(count)} />} />
                    <Route path="/add" element={isAdmin ? <BookForm onBookAdded={(b) => setBooks([...books, b])} /> : <Navigate to="/" replace />} />
                    <Route path="/add-magazine" element={isAdmin ? <MagazineForm onMagazineAdded={(m) => setMagazines([...magazines, m])} /> : <Navigate to="/" replace />} />
                    <Route path="/add-discmag" element={isAdmin ? <DiscMagForm onDiscMagAdded={(m) => setDiscMags([...discMags, m])} /> : <Navigate to="/" replace />} />
                    <Route path="/add-handheld" element={isAdmin ? <HandheldConsoleForm onAdded={(c) => setHandheldConsoles([...handheldConsoles, c])} /> : <Navigate to="/" replace />} />
                    <Route path="/add-home-console" element={isAdmin ? <HomeConsoleForm onAdded={(c) => setHomeConsoles([...homeConsoles, c])} /> : <Navigate to="/" replace />} />
                    <Route path="/add-ticket" element={isAdmin ? <TicketForm onTicketAdded={(t) => setTickets([...tickets, t])} /> : <Navigate to="/" replace />} />
                    <Route path="/logout" element={<Logout />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
