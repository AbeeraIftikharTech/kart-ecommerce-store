'use client';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <div className="tags">
        <span className="tag green">In Stock</span>
      </div>
      <div className="card-img">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="card-body">
        <span className="card-brand plain">{product.category}</span>
        <h3>{product.title}</h3>
        <div className="rating">
          <span className="stars" style={{ '--p': `${(product.rating.rate / 5) * 100}%` }}></span>
          <span>{product.rating.rate} ({product.rating.count})</span>
        </div>
        <div className="card-foot">
          <span className="price">${product.price.toFixed(2)}</span>
          <button onClick={() => addToCart(product)} className="btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}