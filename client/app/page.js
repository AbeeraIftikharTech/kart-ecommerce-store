import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import ProductCard from '../components/ProductCard';
import { fallbackProducts } from '../data/products';

// Runs on the server. If the API fails, we use local products instead of crashing.
async function getProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products', {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error('Bad response: ' + res.status);
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : fallbackProducts;
  } catch (err) {
    console.error('Products fetch failed:', err);
    return fallbackProducts;
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <Hero />
      <main className="wrap section" id="products">
        <div className="grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
      <Cart />
    </>
  );
}