import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen, ShoppingCart, Home, ChevronDown,
  BookMarked, Newspaper, Disc3, Gamepad2, Monitor, Ticket, LogOut, Plus,
} from 'lucide-react';

/* ─── Tokens ───────────────────────────────────────────────────────────── */
const NAV_BG      = '#1A1A2E';
const NAV_BORDER  = '#333355';
const ACTIVE_BG   = 'rgba(112,145,230,.14)';
const ACTIVE_CLR  = '#E0E0FF';
const IDLE_CLR    = '#94A3B8';
const HOVER_BG    = 'rgba(255,255,255,.05)';
const DROP_BG     = '#16213E';
const DROP_SHADOW = '0 8px 24px rgba(0,0,0,.55)';
const ADD_CLR     = '#7ecba1';

/* ─── NavLink ──────────────────────────────────────────────────────────── */
function NavLink({ to, icon: Icon, label, badge }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 11px', borderRadius: 8, textDecoration: 'none',
      fontSize: '0.83rem', fontWeight: active ? 600 : 400,
      color: active ? ACTIVE_CLR : IDLE_CLR,
      background: active ? ACTIVE_BG : 'transparent',
      transition: 'background 0.15s, color 0.15s',
      position: 'relative',
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = HOVER_BG; e.currentTarget.style.color = '#fff'; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = IDLE_CLR; }}}
    >
      {Icon && <Icon size={15} />}
      {label}
      {badge > 0 && (
        <span style={{
          background: '#EF4444', color: '#fff', fontSize: '0.65rem', fontWeight: 700,
          padding: '1px 5px', borderRadius: 999, lineHeight: 1.4, minWidth: 18, textAlign: 'center',
        }}>{badge > 99 ? '99+' : badge}</span>
      )}
    </Link>
  );
}

/* ─── DropdownGroup ────────────────────────────────────────────────────── */
function DropdownGroup({ label, icon: Icon, children }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  const handleEnter = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 220);
  };

  return (
    <div style={{ position: 'relative' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}>
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: IDLE_CLR, padding: '6px 11px', borderRadius: 8,
        fontSize: '0.83rem', fontWeight: 500,
        transition: 'background 0.15s, color 0.15s',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = HOVER_BG; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = IDLE_CLR; }}
      >
        {Icon && <Icon size={14} />}
        {label}
        <ChevronDown size={12} style={{ opacity: 0.6, transition: 'transform .15s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 200,
          background: DROP_BG, borderRadius: 10,
          /* paddingTop bridges the gap so the mouse never leaves the hitbox */
          paddingTop: 8, paddingBottom: 6, paddingLeft: 6, paddingRight: 6,
          marginTop: 0,
          boxShadow: DROP_SHADOW, minWidth: 200,
          border: `1px solid ${NAV_BORDER}`,
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── DropdownItem ─────────────────────────────────────────────────────── */
function DropdownItem({ to, label, type = 'view' }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  const isAdd = type === 'add';
  const baseClr = isAdd ? ADD_CLR : '#bbc';
  return (
    <Link to={to} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      color: active ? '#fff' : baseClr,
      textDecoration: 'none', padding: '7px 12px', borderRadius: 7,
      fontSize: '0.81rem', fontWeight: isAdd ? 400 : 500, fontStyle: isAdd ? 'italic' : 'normal',
      background: active ? (isAdd ? 'rgba(126,203,161,.15)' : 'rgba(255,255,255,.1)') : 'transparent',
      borderLeft: isAdd ? `2px solid rgba(126,203,161,.4)` : '2px solid transparent',
      transition: 'background 0.15s, color 0.15s',
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = isAdd ? 'rgba(126,203,161,.08)' : 'rgba(255,255,255,.07)'; e.currentTarget.style.color = isAdd ? '#a8e6c3' : '#fff'; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = baseClr; }}}
    >
      {isAdd && <Plus size={12} />}
      {label}
    </Link>
  );
}

/* ─── Navbar ───────────────────────────────────────────────────────────── */
function Navbar({ cartCount = 0, isAdmin = false }) {
  return (
    <header style={{
      background: NAV_BG,
      borderBottom: `1px solid ${NAV_BORDER}`,
      position: 'sticky', top: 0, zIndex: 100,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1440, margin: '0 auto',
        padding: '0 32px', height: 52,
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        {/* Brand */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: '#E0E0FF', fontWeight: 700, fontSize: '0.95rem',
          textDecoration: 'none', marginRight: 8, whiteSpace: 'nowrap',
          letterSpacing: '0.3px',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: '#3D52A0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={16} color="#fff" />
          </div>
          Bookstore
        </Link>

        {/* Divider */}
        <div style={{ width: 1, height: 22, background: NAV_BORDER, margin: '0 6px' }} />

        {/* Primary links */}
        <NavLink to="/" icon={Home} label="Home" />
        <NavLink to="/cart" icon={ShoppingCart} label="Cart" badge={cartCount} />

        {/* Dropdowns */}
        <DropdownGroup label="Books" icon={BookMarked}>
          <DropdownItem to="/inventory" label="View Books" />
          {isAdmin && <DropdownItem to="/add" label="Add Book" type="add" />}
        </DropdownGroup>

        <DropdownGroup label="Magazines" icon={Newspaper}>
          <DropdownItem to="/magazines" label="Magazines" />
          {isAdmin && <DropdownItem to="/add-magazine" label="Add Magazine" type="add" />}
          <DropdownItem to="/discmags" label="Disc Magazines" />
          {isAdmin && <DropdownItem to="/add-discmag" label="Add Disc Mag" type="add" />}
        </DropdownGroup>

        <DropdownGroup label="Consoles" icon={Gamepad2}>
          <DropdownItem to="/handheld-consoles" label="Handheld Consoles" />
          {isAdmin && <DropdownItem to="/add-handheld" label="Add Handheld" type="add" />}
          <DropdownItem to="/home-consoles" label="Home Consoles" />
          {isAdmin && <DropdownItem to="/add-home-console" label="Add Home Console" type="add" />}
        </DropdownGroup>

        <DropdownGroup label="Tickets" icon={Ticket}>
          <DropdownItem to="/tickets" label="View Tickets" />
          {isAdmin && <DropdownItem to="/add-ticket" label="Add Ticket" type="add" />}
        </DropdownGroup>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Logout */}
        <Link to="/logout" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#EF4444', textDecoration: 'none',
          padding: '6px 11px', borderRadius: 8,
          fontSize: '0.83rem', fontWeight: 500,
          transition: 'background 0.15s, color 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={15} />
          Logout
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
