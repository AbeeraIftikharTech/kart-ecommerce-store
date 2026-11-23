'use client';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        {/* Newsletter */}
        <div className="sf-news">
          <div>
            <h3>Get 10% off your first order</h3>
            <p>Join our newsletter for new arrivals and member-only deals.</p>
          </div>
          <form className="sf-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" />
            <button type="submit" className="btn amber">Subscribe</button>
          </form>
        </div>

        {/* Grid */}
        <div className="sf-grid">
          <div className="sf-about">
            <a href="/" className="logo light"><span>K</span> Kart</a>
            <p>Quality electronics, jewelry and clothing from brands you trust, delivered to your door.</p>
            <ul className="sf-contact">
              <li>hello@kart.example</li>
              <li>Mon-Sat: 9am - 6pm</li>
            </ul>
          </div>

          <div>
            <h4>Shop</h4>
            <ul>
              <li><a href="#">All products</a></li>
              <li><a href="#">Electronics</a></li>
              <li><a href="#">Jewelry</a></li>
              <li><a href="#">Clothing</a></li>
            </ul>
          </div>

          <div>
            <h4>Top Brands</h4>
            <ul>
              <li><a href="#">Samsung ↗</a></li>
              <li><a href="#">Western Digital ↗</a></li>
              <li><a href="#">SanDisk ↗</a></li>
              <li><a href="#">Acer ↗</a></li>
            </ul>
          </div>

          <div>
            <h4>Our Promise</h4>
            <ul className="sf-promise">
              <li>Free shipping over $100</li>
              <li>30-day easy returns</li>
              <li>Secure checkout</li>
              <li>Genuine brands only</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="sf-bottom">
          <p>© {new Date().getFullYear()} Kart. All rights reserved.</p>
          <p>Demo store. No real payments are taken.</p>
          <a href="#">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}