import { BookOpen } from 'lucide-react';

function Home() {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                }}
            >
                <BookOpen size={34} />
            </div>
            <h1>CSD230 - Bookstore</h1>
            <p>Use the navigation bar above to manage your digital library.</p>
        </div>
    );
}

export default Home;