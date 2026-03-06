import { Link } from '@inertiajs/react';

export default function Navbar({ title }) {
    return (
        <header
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.1rem 1.5rem 0.9rem 1.5rem',
                borderBottom: '4px double #222',
                background: '#faf9f6',
                fontFamily: 'Georgia, Times, "Times New Roman", serif',
                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
            }}
        >
            <h1 style={{
                margin: 0,
                fontSize: '2rem',
                fontWeight: 900,
                color: '#222',
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontFamily: 'Georgia, Times, "Times New Roman", serif',
            }}>{title}</h1>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                <Link href={route('profile.edit')} style={{ color: '#222', textDecoration: 'none', fontWeight: 700, fontFamily: 'Georgia, Times, "Times New Roman", serif' }}>
                    Profile
                </Link>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    style={{
                        background: '#222',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '0',
                        padding: '0.5rem 1.1rem',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontFamily: 'Georgia, Times, "Times New Roman", serif',
                        fontSize: '1rem',
                        letterSpacing: 0.5,
                        textTransform: 'uppercase',
                    }}
                >
                    Log Out
                </Link>
            </div>
        </header>
    );
}
