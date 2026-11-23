'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from './ProductCard';

const label = (c) => c.charAt(0).toUpperCase() + c.slice(1);

export default function ProductGrid({ products }) {
  const params = useSearchParams();
  const router = useRouter();

  const q = (params.get('q') || '').trim().toLowerCase();
  const cat = params.get('cat') || 'all';

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const setCategory = (value) => {
    const next = new URLSearchParams(params.toString());
    if (value === 'all') next.delete('cat');
    else next.set('cat', value);
    const qs = next.toString();
    router.replace(qs ? `/?${qs}#products` : '/#products', { scroll: false });
  };

  const filtered = products.filter((p) => {
    const matchesCat = cat === 'all' || p.category === cat;
    const matchesSearch =
      !q ||
      String(p.title || '').toLowerCase().includes(q) ||
      String(p.category || '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        <button
          className={cat === 'all' ? 'btn' : 'btn ghost'}
          onClick={() => setCategory('all')}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            className={cat === c ? 'btn' : 'btn ghost'}
            onClick={() => setCategory(c)}
          >
            {label(c)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="state">
          <h3>No products found</h3>
          <p>Nothing matches your search. Try a different word or category.</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}