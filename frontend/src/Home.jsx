import { Link } from 'react-router-dom';
import {
  BookMarked, Newspaper, Disc3, Gamepad2,
  Monitor, Ticket, ShoppingCart,
} from 'lucide-react';

const CATEGORIES = [
  { label: 'Books',            sub: 'Browse the collection',    to: '/inventory',        icon: BookMarked, grad: 'linear-gradient(135deg,#3D52A0,#9B72CF)' },
  { label: 'Magazines',        sub: 'Latest issues & disc mags', to: '/magazines',        icon: Newspaper,  grad: 'linear-gradient(135deg,#2DD4BF,#3D52A0)' },
  { label: 'Disc Magazines',   sub: 'With included disc media',  to: '/discmags',         icon: Disc3,      grad: 'linear-gradient(135deg,#F59E0B,#EF4444)' },
  { label: 'Handheld Consoles',sub: 'Portable gaming devices',   to: '/handheld-consoles',icon: Gamepad2,   grad: 'linear-gradient(135deg,#2DD4BF,#48CAE4)' },
  { label: 'Home Consoles',    sub: 'Living room gaming',        to: '/home-consoles',    icon: Monitor,    grad: 'linear-gradient(135deg,#3D52A0,#48CAE4)' },
  { label: 'Tickets',          sub: 'Events & entertainment',    to: '/tickets',          icon: Ticket,     grad: 'linear-gradient(135deg,#EF4444,#9B72CF)' },
];

function CategoryCard({ label, sub, to, icon: Icon, grad }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#16213E', border: '1px solid #333355', borderRadius: 16,
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'transform 0.15s, box-shadow 0.15s, border-color 0.15s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.5)'; e.currentTarget.style.borderColor = 'rgba(112,145,230,.4)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#333355'; }}
      >
        {/* Cover */}
        <div style={{ height: 80, background: grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={32} color="rgba(255,255,255,0.9)" />
        </div>
        {/* Info */}
        <div style={{ padding: '12px 14px' }}>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#E0E0FF', marginBottom: 2 }}>{label}</p>
          <p style={{ fontSize: '0.74rem', color: '#64748B' }}>{sub}</p>
        </div>
      </div>
    </Link>
  );
}

function Home() {
  return (
    <div style={{ padding: '40px 32px', maxWidth: 1440, margin: '0 auto', width: '100%' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 60%, rgba(61,82,160,.25) 100%)',
        border: '1px solid #333355', borderRadius: 20, padding: '44px 40px', marginBottom: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32,
        overflow: 'hidden', position: 'relative',
      }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, background: 'rgba(61,82,160,.18)', borderRadius: '50%', filter: 'blur(48px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: 200, width: 160, height: 160, background: 'rgba(72,202,228,.10)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#E0E0FF', marginBottom: 10, lineHeight: 1.2 }}>
            Bookstore &amp;<br />
            <span style={{ background: 'linear-gradient(90deg, #7091E6, #48CAE4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Media Catalog</span>
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: 24, maxWidth: 420 }}>
            Browse books, magazines, gaming consoles and event tickets — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/inventory" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 20px', borderRadius: 10,
              background: '#3D52A0', color: '#fff',
              fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#7091E6'}
              onMouseLeave={e => e.currentTarget.style.background = '#3D52A0'}
            >
              <BookMarked size={15} /> Browse Books
            </Link>
            <Link to="/cart" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 20px', borderRadius: 10,
              background: 'rgba(255,255,255,.06)', color: '#E0E0FF',
              border: '1px solid #333355',
              fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.06)'}
            >
              <ShoppingCart size={15} /> View Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Category grid */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#94A3B8', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
        Browse Categories
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
        {CATEGORIES.map(c => <CategoryCard key={c.label} {...c} />)}
      </div>
    </div>
  );
}

export default Home;