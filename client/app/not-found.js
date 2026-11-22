import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="wrap" style={{ textAlign: 'center', padding: '120px 16px' }}>
      <p style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--brand)', lineHeight: 1 }}>404</p>
      <h1 style={{ margin: '12px 0 8px' }}>Page not found</h1>
      <p className="muted" style={{ marginBottom: 24 }}>The page you are looking for does not exist.</p>
      <Link className="btn lg" href="/">Back to Kart</Link>
    </main>
  );
}
