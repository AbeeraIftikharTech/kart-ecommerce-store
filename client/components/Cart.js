'use client';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  } = useCart();

  const [order, setOrder] = useState(null);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    const orderId = 'KRT-' + Math.floor(100000 + Math.random() * 900000);
    setOrder({
      id: orderId,
      items: cart.map((i) => ({ ...i })),
      subtotal,
      tax,
      shipping,
      total,
    });
    setIsCartOpen(false);
    if (clearCart) clearCart();
  };

  return (
    <>
      {/* Overlay Background */}
      <div className={`overlay ${isCartOpen ? 'show' : ''}`} onClick={() => setIsCartOpen(false)}></div>

      {/* Drawer */}
      <div className={`drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="drawer-head">
          <h2>Your Cart</h2>
          <button className="icon-btn" onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

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

      {/* Order confirmation modal */}
      {order && (
        <div
          onClick={() => setOrder(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{
              background: '#fff', color: '#0b1220', borderRadius: 16,
              width: '100%', maxWidth: 440, padding: 28, maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: '#e6f7ee',
                color: '#0a9d58', fontSize: 28, display: 'flex',
                alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px',
              }}>✓</div>
              <h2 style={{ margin: 0 }}>Order Confirmed!</h2>
              <p style={{ margin: '6px 0 0', color: '#667085' }}>
                Thank you for shopping. Order number <strong>{order.id}</strong>
              </p>
            </div>

            <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '12px 0', margin: '12px 0' }}>
              {order.items.map((i) => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14, padding: '4px 0' }}>
                  <span>{i.title} × {i.quantity}</span>
                  <span>${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax (8%)</span><span>${order.tax.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginTop: 8 }}>
                <span>Total</span><span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <button className="btn block" style={{ marginTop: 20 }} onClick={() => setOrder(null)}>
              Continue Shopping
            </button>
            <p style={{ textAlign: 'center', color: '#98a2b3', fontSize: 12, margin: '12px 0 0' }}>
              Demo store. No real payment was taken.
            </p>
          </div>
        </div>
      )}
    </>
  );
}