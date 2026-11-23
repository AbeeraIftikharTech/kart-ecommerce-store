import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import ProductCard from '../components/ProductCard';

// This function runs on the server, not in the browser
async function getProducts() {
  const res = await fetch('https://fakestoreapi.com/products', { 
    cache: 'no-store' // Ensures fresh data
  });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
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