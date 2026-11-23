'use client';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  const params = useSearchParams();
  const q = (params.get('q') || '').trim().toLowerCase();

  const filtered = q
    ? products.filter(
        (p) =>
          String(p.title || '').toLowerCase().includes(q) ||
          String(p.category || '').toLowerCase().includes(q)
      )
    : products;

  if (filtered.length === 0) {
    return (
      <div className="state">
        <h3>No products found</h3>
        <p>Nothing matches &quot;{q}&quot;. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}