'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Header({ hideSearch = false }) {
  const { cart, setIsCartOpen } = useCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    router.replace(
      value.trim() ? `/?q=${encodeURIComponent(value.trim())}` : '/',
      { scroll: false }
    );
  };

  return (
    <>
      <div className="promo">
        Free shipping on orders over $100 — Shop now!
      </div>

      <header className="header">
        <div className="wrap header-in">
          <a href="/" className="logo">
            <span>K</span> Kart
          </a>
          {hideSearch ? (
            <div style={{ flex: 1 }} />
          ) : (
            <input
              type="text"
              className="search"
              placeholder="Search products or brands..."
              value={query}
              onChange={handleSearch}
            />
          )}
          <button className="cart-btn" onClick={() => setIsCartOpen(true)} aria-label="Open Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {itemCount > 0 && <span className="badge">{itemCount}</span>}
          </button>
        </div>
      </header>
    </>
  );
}