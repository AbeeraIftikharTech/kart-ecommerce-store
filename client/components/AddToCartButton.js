'use client';
import { useCart } from '../context/CartContext';

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  return (
    <button className="btn lg block" onClick={() => addToCart(product)}>
      Add to cart
    </button>
  );
}