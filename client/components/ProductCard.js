'use client';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="100%" height="100%" fill="%23eeeeee"/><text x="50%" y="50%" text-anchor="middle" fill="%23999999" font-size="18" font-family="sans-serif">No image</text></svg>';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const rate = Number(product?.rating?.rate) || 0;
  const count = Number(product?.rating?.count) || 0;
  const price = Number(product?.price) || 0;
  const href = `/products/${product.id}`;

  return (
    <div className="card">
      <div className="tags">
        <span className="tag green">In Stock</span>
      </div>
      <Link href={href} className="card-img">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER;
          }}
        />
      </Link>
      <div className="card-body">
        <span className="card-brand plain">{product.category}</span>
        <h3>
          <Link href={href} style={{ color: 'inherit' }}>
            {product.title}
          </Link>
        </h3>
        <div className="rating">
          <span className="stars" style={{ '--p': `${(rate / 5) * 100}%` }}></span>
          <span>{rate} ({count})</span>
        </div>
        <div className="card-foot">
          <span className="price">${price.toFixed(2)}</span>
          <button onClick={() => addToCart(product)} className="btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}