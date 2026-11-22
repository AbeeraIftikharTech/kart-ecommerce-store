'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ProductCard, { Stars } from '../../../components/ProductCard';
import { useCart, money } from '../../../components/Cart';

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [state, setState] = useState({ status: 'loading', product: null, related: [] });
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    setState({ status: 'loading', product: null, related: [] });
    fetch(`/api/products/${id}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setState({ status: 'ready', ...d }); document.title = `${d.product.title} | Kart`; })
      .catch(() => setState({ status: 'error', product: null, related: [] }));
    window.scrollTo(0, 0);
  }, [id]);
  useEffect(() => { fetch('/api/brands').then(r => r.json()).then(setBrands).catch(() => {}); }, []);

  const { status, product: p, related } = state;
  const eta = (() => { const d = n => new Date(Date.now() + n * 864e5).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); return `${d(3)} – ${d(5)}`; })();

  return (
    <div>
      <Header hideSearch />
      <main className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/#catalog">Catalog</Link>{p && <> / <span>{p.group}</span></>}
        </nav>

        {status === 'loading' && <div className="skeleton" style={{ height: 460 }} />}
        {status === 'error' && <div className="state"><h3>Product not found</h3><p>It may have been removed.</p><Link className="btn" href="/">Back to shop</Link></div>}

        {status === 'ready' && (<>
          <section className="pd">
            <div className="pd-img"><img src={p.image} alt={p.title} /></div>
            <div className="pd-info">
              {p.brand
                ? <a className="card-brand" href={p.brand.url} target="_blank" rel="noopener noreferrer">{p.brand.name} ↗ Official site</a>
                : <span className="card-brand plain">{p.group}</span>}
              <h1>{p.title}</h1>
              <div className="rating"><Stars rate={p.rating.rate} /><span>{p.rating.rate} · {p.rating.count} reviews</span></div>
              <div className="pd-price">{money(p.price)}</div>
              <p className="pd-desc">{p.description}</p>
              <button className="btn lg block" onClick={() => addToCart(p)}>Add to cart</button>
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
              <div className="section-head"><h2>You may also like</h2></div>
              <div className="grid">{related.map(r => <ProductCard key={r.id} p={r} />)}</div>
            </section>
          )}
        </>)}
      </main>
      <Footer brands={brands} />
    </div>
  );
}
