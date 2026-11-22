// client/components/Hero.js
export default function Hero() {
  return (
    <div className="wrap">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">New Season Arrivals</span>
          <h1>Elevate Your Everyday with Premium Tech & Style</h1>
          <p>Discover our curated collection of top-tier electronics, jewelry, and fashion. Quality you can trust, delivered to your door.</p>
          <div className="hero-cta">
            <a href="#products" className="btn lg amber">Explore Collection</a>
            <a href="#" className="btn lg outline">View Deals</a>
          </div>
          <dl className="stats">
            <div><dt>10k+</dt><dd>Happy Customers</dd></div>
            <div><dt>500+</dt><dd>Premium Brands</dd></div>
          </dl>
        </div>
        
        <div className="tiles">
          <a href="#" className="tile">
            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop" alt="Headphones" />
          </a>
          <a href="#" className="tile">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop" alt="Watch" />
          </a>
          <a href="#" className="tile">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop" alt="Shoes" />
          </a>
          {/* New 4th image added below to fill the grid */}
          <a href="#" className="tile">
            <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop" alt="Camera" />
          </a>
        </div>
      </section>
    </div>
  );
}