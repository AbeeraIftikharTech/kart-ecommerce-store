'use client'; 

import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Cart from '../components/Cart';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  }, [category, products]);

  if (loading) return <div className="center muted">Loading products...</div>;

  return (
    <>
      <Header />
      
      <Hero />
      
      {/* The page now goes straight from the Hero to the Product Catalog */}
      <main className="wrap section" id="products">
        
        {/* Category Filters */}
        <div className="toolbar">
          <div className="chips">
            <button className="chip" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>All</button>
            <button className="chip" aria-pressed={category === 'electronics'} onClick={() => setCategory('electronics')}>Electronics</button>
            <button className="chip" aria-pressed={category === 'jewelery'} onClick={() => setCategory('jewelery')}>Jewelry</button>
            <button className="chip" aria-pressed={category === "men's clothing"} onClick={() => setCategory("men's clothing")}>Men's Clothing</button>
            <button className="chip" aria-pressed={category === "women's clothing"} onClick={() => setCategory("women's clothing")}>Women's Clothing</button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      
      <Footer />
      
      <Cart />
    </>
  );
}