'use client';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    clearCart // Assuming you can add this to Context
  } = useCart();

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; 
  const shipping = subtotal > 100 ? 0 : 10; 
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    alert("Order Confirmed! Thank you for shopping.");
    setIsCartOpen(false);
    // Optional: Reset cart after checkout
    if (clearCart) clearCart(); 
  };

  return (
    <>
      {/* Overlay Background */}
      <div className={`overlay ${isCartOpen ? 'show' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      
      {/* Drawer */}
      <div className={`drawer ${isCartOpen ? 'open' : ''}`}>
        
        {/* Header */}
        <div className="drawer-head">
          <h2>Your Cart</h2>
          <button className="icon-btn" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        {/* Body (Items) */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="center muted">
              <p>Your cart is empty.</p>
              <button className="btn ghost" onClick={() => setIsCartOpen(false)}>Continue Shopping</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="line">
                <img src={item.image} alt={item.title} />
                <div>
                  <h4>{item.title}</h4>
                  <div className="qty">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
                <div className="line-end">
                  <span className="price">${(item.price * item.quantity).toFixed(2)}</span>
                  <button className="link-danger" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer (Summary) */}
        {cart.length > 0 && (
          <div className="drawer-foot">
            <div className="sum"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="sum"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="sum"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
            <div className="sum total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <button className="btn block" onClick={handleCheckout}>Checkout</button>
          </div>
        )}
      </div>
    </>
  );
}