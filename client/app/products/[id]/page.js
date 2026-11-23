import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProductCard from '../../../components/ProductCard';
import AddToCartButton from '../../../components/AddToCartButton';
import { fallbackProducts } from '../../../data/products';

const money = (n) => `$${Number(n || 0).toFixed(2)}`;

function Stars({ rate }) {
  return <span className="stars" style={{ '--p': `${(Number(rate) / 5) * 100}%` }}></span>;
}

async function getAllProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000), // give up after 5 seconds
    });
    if (!res.ok) throw new Error('Bad response: ' + res.status);
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : fallbackProducts;
  } catch (err) {
    console.error('Products fetch failed:', err);
    return fallbackProducts;
  }
}

export async function generateMetadata({ params }) {
  const all = await getAllProducts();
  const p = all.find((x) => String(x.id) === String(params.id));
  return { title: p ? `${p.title} | Kart` : 'Product | Kart' };
}

export default async function ProductPage({ params }) {
  const all = await getAllProducts();
  const p = all.find((x) => String(x.id) === String(params.id));
  if (!p) notFound();

  const related = all.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  const d = (n) =>
    new Date(Date.now() + n * 864e5).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const eta = `${d(3)} – ${d(5)}`;

  return (
    <div>
      <Header hideSearch />
      <main className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/#products">Catalog</Link> / <span>{p.category}</span>
        </nav>

        <section className="pd">
          <div className="pd-img">
            <img src={p.image} alt={p.title} />
          </div>
          <div className="pd-info">
            <span className="card-brand plain">{p.category}</span>
            <h1>{p.title}</h1>
            <div className="rating">
              <Stars rate={p.rating?.rate} />
              <span>
                {p.rating?.rate} · {p.rating?.count} reviews
              </span>
            </div>
            <div className="pd-price">{money(p.price)}</div>
            <p className="pd-desc">{p.description}</p>
            <AddToCartButton product={p} />
            <ul className="pd-perks">
              <li>Estimated delivery {eta}</li>
              <li>{p.price >= 100 ? 'Free shipping on this item' : 'Free shipping over $100'}</li>
              <li>30-day easy returns</li>
              <li>In stock and ready to ship</li>
            </ul>
          </div>
        </section>

        {related.length > 0 && (
          <section className="section">
            <div className="section-head">
              <h2>You may also like</h2>
            </div>
            <div className="grid">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}