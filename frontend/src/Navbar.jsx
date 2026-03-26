import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DoorOpen } from 'lucide-react';

const navStyle = {
    nav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#1a1a2e',
        padding: '0 24px',
        height: '52px',
        borderRadius: '10px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        position: 'relative',
        zIndex: 100,
        gap: '4px',
    },
    brand: {
        color: '#e0e0ff',
        fontWeight: '700',
        fontSize: '1rem',
        textDecoration: 'none',
        marginRight: '12px',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
    },
    divider: {
        width: '1px',
        height: '24px',
        backgroundColor: '#333355',
        margin: '0 8px',
    },
};

function NavItem({ to, label, active }) {
    return (
        <Link
            to={to}
            style={{
                color: active ? '#fff' : '#aab',
                textDecoration: 'none',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '0.83rem',
                fontWeight: active ? '600' : '400',
                backgroundColor: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                transition: 'background 0.15s, color 0.15s',
                whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!active) { e.target.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.target.style.color = '#fff'; }}}
            onMouseLeave={e => { if (!active) { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#aab'; }}}
        >
            {label}
        </Link>
    );
}

function DropdownGroup({ label, children }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#aab', padding: '6px 10px', borderRadius: '6px',
                fontSize: '0.83rem', fontWeight: '500', whiteSpace: 'nowrap',
                transition: 'background 0.15s, color 0.15s',
            }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#aab'; }}
            >
                {label} <span style={{ fontSize: '0.6rem', opacity: 0.7, marginTop: '1px' }}>&#9660;</span>
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0,
                    backgroundColor: '#16213e', borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    minWidth: '180px', padding: '6px',
                    display: 'flex', flexDirection: 'column', gap: '2px',
                    border: '1px solid rgba(255,255,255,0.07)',
                }}>
                    {children}
                </div>
            )}
        </div>
    );
}

// type: 'view' (default) | 'add'
function DropdownItem({ to, label, type = 'view' }) {
    const location = useLocation();
    const active = location.pathname === to;

    const isAdd = type === 'add';

    const baseColor   = isAdd ? '#7ecba1' : '#bbc';
    const activeColor = '#fff';
    const activeBg    = isAdd ? 'rgba(126,203,161,0.15)' : 'rgba(255,255,255,0.1)';
    const hoverBg     = isAdd ? 'rgba(126,203,161,0.08)' : 'rgba(255,255,255,0.07)';
    const hoverColor  = isAdd ? '#a8e6c3' : '#fff';

    return (
        <Link
            to={to}
            style={{
                color: active ? activeColor : baseColor,
                textDecoration: 'none',
                padding: '7px 12px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: isAdd ? '400' : '500',
                fontStyle: isAdd ? 'italic' : 'normal',
                backgroundColor: active ? activeBg : 'transparent',
                borderLeft: isAdd ? '2px solid rgba(126,203,161,0.4)' : '2px solid transparent',
                transition: 'background 0.15s, color 0.15s',
                display: 'block',
            }}
            onMouseEnter={e => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = hoverBg;
                    e.currentTarget.style.color = hoverColor;
                }
            }}
            onMouseLeave={e => {
                if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = baseColor;
                }
            }}
        >
            {isAdd ? '+ ' : ''}{label}
        </Link>
    );
}

function Navbar({ isAdmin = false, cartCount = 0 }) {
    const location = useLocation();

    return (
        <nav style={navStyle.nav}>
            <Link to="/" style={navStyle.brand}>Bookstore</Link>
            <div style={navStyle.divider} />

            <NavItem to="/" label="Home" active={location.pathname === '/'} />
            <NavItem
                to="/cart"
                label={`Cart${cartCount > 0 ? ` (${cartCount > 99 ? '99+' : cartCount})` : ''}`}
                active={location.pathname === '/cart'}
            />

            <DropdownGroup label="Books">
                <DropdownItem to="/inventory" label="View Books" />
                {isAdmin && <DropdownItem to="/add" label="Add Book" type="add" />}
            </DropdownGroup>

            <DropdownGroup label="Magazines">
                <DropdownItem to="/magazines" label="View Magazines" />
                {isAdmin && <DropdownItem to="/add-magazine" label="Add Magazine" type="add" />}
                <DropdownItem to="/discmags" label="Disc Magazines" />
                {isAdmin && <DropdownItem to="/add-discmag" label="Add Disc Mag" type="add" />}
            </DropdownGroup>

            <DropdownGroup label="Consoles">
                <DropdownItem to="/handheld-consoles" label="Handheld Consoles" />
                {isAdmin && <DropdownItem to="/add-handheld" label="Add Handheld" type="add" />}
                <DropdownItem to="/home-consoles" label="Home Consoles" />
                {isAdmin && <DropdownItem to="/add-home-console" label="Add Home Console" type="add" />}
            </DropdownGroup>

            <DropdownGroup label="Tickets">
                <DropdownItem to="/tickets" label="View Tickets" />
                {isAdmin && <DropdownItem to="/add-ticket" label="Add Ticket" type="add" />}
            </DropdownGroup>

            <Link
                to="/logout"
                style={{
                    color: '#ff4444',
                    marginLeft: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                }}
            >
                <DoorOpen size={16} />
                Logout
            </Link>
        </nav>
    );
}

export default Navbar;
