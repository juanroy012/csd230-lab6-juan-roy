import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router';
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
import {
    BookOpen, Newspaper, Disc3, Gamepad2,
    Monitor, Ticket as TicketIcon, Plus,
} from 'lucide-react';

/* ─── Reusable page section ────────────────────────────────────────────── */
function PageSection({ title, icon: Icon, grad, addTo, children }) {
    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div className="page-title">
                    <div className="page-title-icon" style={{ background: grad }}>
                        <Icon size={20} color="#fff" />
                    </div>
                    <h1>{title}</h1>
                </div>
                {addTo && (
                    <Link to={addTo} className="btn btn-primary btn-sm">
                        <Plus size={13} /> Add New
                    </Link>
                )}
            </div>
            <div className="products-grid">{children}</div>
        </div>
    );
}

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
        if (!token) { setLoading(false); return; }
        const loadInitialData = async () => {
            try {
                const [booksRes, magsRes, discMagsRes, handheldRes, homeRes, ticketsRes, cartRes] = await Promise.all([
                    api.get('/books'), api.get('/magazines'), api.get('/discmags'),
                    api.get('/handheld-consoles'), api.get('/home-consoles'),
                    api.get('/tickets'), api.get('/cart'),
                ]);
                setBooks(booksRes.data);
                setMagazines(magsRes.data);
                setDiscMags(discMagsRes.data);
                setHandheldConsoles(handheldRes.data);
                setHomeConsoles(homeRes.data);
                setTickets(ticketsRes.data);
                setCartCount(cartRes.data?.products?.length ?? 0);
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
            setCartCount(res.data?.products?.length ?? 0);
        } catch (err) {
            console.error('Error adding to cart', err);
        }
    };

    const handleDeleteBook = async (id) => {
        if (!isAdmin || !window.confirm('Delete this book?')) return;
        await api.delete(`/books/${id}`);
        setBooks(books.filter(b => b.id !== id));
    };
    const handleUpdateBook = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/books/${id}`, data);
        setBooks(books.map(b => b.id === id ? res.data : b));
    };

    const handleDeleteMagazine = async (id) => {
        if (!isAdmin || !window.confirm('Delete this magazine?')) return;
        await api.delete(`/magazines/${id}`);
        setMagazines(magazines.filter(m => m.id !== id));
    };
    const handleUpdateMagazine = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/magazines/${id}`, data);
        setMagazines(magazines.map(m => m.id === id ? res.data : m));
    };

    const handleDeleteDiscMag = async (id) => {
        if (!isAdmin || !window.confirm('Delete this disc magazine?')) return;
        await api.delete(`/discmags/${id}`);
        setDiscMags(discMags.filter(m => m.id !== id));
    };
    const handleUpdateDiscMag = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/discmags/${id}`, data);
        setDiscMags(discMags.map(m => m.id === id ? res.data : m));
    };

    const handleDeleteHandheld = async (id) => {
        if (!isAdmin || !window.confirm('Delete this handheld console?')) return;
        await api.delete(`/handheld-consoles/${id}`);
        setHandheldConsoles(handheldConsoles.filter(c => c.id !== id));
    };
    const handleUpdateHandheld = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/handheld-consoles/${id}`, data);
        setHandheldConsoles(handheldConsoles.map(c => c.id === id ? res.data : c));
    };

    const handleDeleteHomeConsole = async (id) => {
        if (!isAdmin || !window.confirm('Delete this home console?')) return;
        await api.delete(`/home-consoles/${id}`);
        setHomeConsoles(homeConsoles.filter(c => c.id !== id));
    };
    const handleUpdateHomeConsole = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/home-consoles/${id}`, data);
        setHomeConsoles(homeConsoles.map(c => c.id === id ? res.data : c));
    };

    const handleDeleteTicket = async (id) => {
        if (!isAdmin || !window.confirm('Delete this ticket?')) return;
        await api.delete(`/tickets/${id}`);
        setTickets(tickets.filter(t => t.id !== id));
    };
    const handleUpdateTicket = async (id, data) => {
        if (!isAdmin) return;
        const res = await api.put(`/tickets/${id}`, data);
        setTickets(tickets.map(t => t.id === id ? res.data : t));
    };

    if (loading) {
        return (
            <div className="loading-state" style={{ minHeight: '100vh' }}>
                <div className="spinner" />
                <p>Loading Libris…</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            {token && <Navbar cartCount={cartCount} isAdmin={isAdmin} />}

            <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />

                    <Route path="/inventory" element={
                        <PageSection title="Books" icon={BookOpen} grad="linear-gradient(135deg,#3D52A0,#9B72CF)" addTo={isAdmin ? '/add' : null}>
                            {books.map(b => <Book key={b.id} {...b} canManage={isAdmin} onDelete={handleDeleteBook} onUpdate={handleUpdateBook} onAddToCart={handleAddToCart} />)}
                        </PageSection>
                    } />

                    <Route path="/magazines" element={
                        <PageSection title="Magazines" icon={Newspaper} grad="linear-gradient(135deg,#2DD4BF,#3D52A0)" addTo={isAdmin ? '/add-magazine' : null}>
                            {magazines.map(m => <Magazine key={m.id} {...m} canManage={isAdmin} onDelete={handleDeleteMagazine} onUpdate={handleUpdateMagazine} onAddToCart={handleAddToCart} />)}
                        </PageSection>
                    } />

                    <Route path="/discmags" element={
                        <PageSection title="Disc Magazines" icon={Disc3} grad="linear-gradient(135deg,#F59E0B,#EF4444)" addTo={isAdmin ? '/add-discmag' : null}>
                            {discMags.map(m => <DiscMag key={m.id} {...m} canManage={isAdmin} onDelete={handleDeleteDiscMag} onUpdate={handleUpdateDiscMag} onAddToCart={handleAddToCart} />)}
                        </PageSection>
                    } />

                    <Route path="/handheld-consoles" element={
                        <PageSection title="Handheld Consoles" icon={Gamepad2} grad="linear-gradient(135deg,#2DD4BF,#48CAE4)" addTo={isAdmin ? '/add-handheld' : null}>
                            {handheldConsoles.map(c => <HandheldConsole key={c.id} {...c} canManage={isAdmin} onDelete={handleDeleteHandheld} onUpdate={handleUpdateHandheld} onAddToCart={handleAddToCart} />)}
                        </PageSection>
                    } />

                    <Route path="/home-consoles" element={
                        <PageSection title="Home Consoles" icon={Monitor} grad="linear-gradient(135deg,#3D52A0,#48CAE4)" addTo={isAdmin ? '/add-home-console' : null}>
                            {homeConsoles.map(c => <HomeConsole key={c.id} {...c} canManage={isAdmin} onDelete={handleDeleteHomeConsole} onUpdate={handleUpdateHomeConsole} onAddToCart={handleAddToCart} />)}
                        </PageSection>
                    } />

                    <Route path="/tickets" element={
                        <PageSection title="Tickets" icon={TicketIcon} grad="linear-gradient(135deg,#EF4444,#9B72CF)" addTo={isAdmin ? '/add-ticket' : null}>
                            {tickets.map(t => <Ticket key={t.id} {...t} canManage={isAdmin} onDelete={handleDeleteTicket} onUpdate={handleUpdateTicket} onAddToCart={handleAddToCart} />)}
                        </PageSection>
                    } />

                    <Route path="/cart" element={<Cart api={api} onCartChange={(count) => setCartCount(count)} />} />

                    <Route path="/add"              element={isAdmin ? <BookForm onBookAdded={(b) => setBooks([...books, b])} /> : <Navigate to="/" replace />} />
                    <Route path="/add-magazine"     element={isAdmin ? <MagazineForm onMagazineAdded={(m) => setMagazines([...magazines, m])} /> : <Navigate to="/" replace />} />
                    <Route path="/add-discmag"      element={isAdmin ? <DiscMagForm onDiscMagAdded={(m) => setDiscMags([...discMags, m])} /> : <Navigate to="/" replace />} />
                    <Route path="/add-handheld"     element={isAdmin ? <HandheldConsoleForm onAdded={(c) => setHandheldConsoles([...handheldConsoles, c])} /> : <Navigate to="/" replace />} />
                    <Route path="/add-home-console" element={isAdmin ? <HomeConsoleForm onAdded={(c) => setHomeConsoles([...homeConsoles, c])} /> : <Navigate to="/" replace />} />
                    <Route path="/add-ticket"       element={isAdmin ? <TicketForm onTicketAdded={(t) => setTickets([...tickets, t])} /> : <Navigate to="/" replace />} />

                    <Route path="/logout" element={<Logout />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
