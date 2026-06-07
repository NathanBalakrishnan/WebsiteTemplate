// src/pages/preview/shopping-cart/ShoppingCheckout.jsx
import { useState } from 'react';

export default function ShoppingCheckout({ cart, cartTotal, clearCart, setActiveTab }) {
  const [form, setForm] = useState({ name: '', email: '', address: '', card: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Order placed successfully! Thank you for shopping with us.');
    clearCart();
    setActiveTab('Home');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>No items to checkout</h2>
        <button 
          onClick={() => setActiveTab('Home')} 
          style={{ backgroundColor: 'var(--button-bg)' }}
          className="text-white px-6 py-2 rounded-full font-semibold cursor-pointer hover:opacity-90"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <form 
        onSubmit={handleSubmit} 
        className="rounded-2xl p-6"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)'
        }}
      >
        <h2 className="font-bold text-xl mb-4" style={{ color: 'var(--text-color)' }}>Shipping Information</h2>
        <input 
          type="text" 
          placeholder="Full Name" 
          required 
          className="w-full bg-white/20 text-white px-4 py-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-white/50"
          value={form.name} 
          onChange={(e) => setForm({...form, name: e.target.value})} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          required 
          className="w-full bg-white/20 text-white px-4 py-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-white/50"
          value={form.email} 
          onChange={(e) => setForm({...form, email: e.target.value})} 
        />
        <input 
          type="text" 
          placeholder="Address" 
          required 
          className="w-full bg-white/20 text-white px-4 py-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-white/50"
          value={form.address} 
          onChange={(e) => setForm({...form, address: e.target.value})} 
        />
        <input 
          type="text" 
          placeholder="Card Number" 
          required 
          className="w-full bg-white/20 text-white px-4 py-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-white/50"
          value={form.card} 
          onChange={(e) => setForm({...form, card: e.target.value})} 
        />
        <button 
          type="submit" 
          style={{ backgroundColor: 'var(--button-bg)' }}
          className="w-full py-3 rounded-xl font-semibold transition cursor-pointer hover:opacity-90 text-white"
        >
          Place Order • ${cartTotal.toFixed(2)}
        </button>
      </form>
      
      <div 
        className="rounded-2xl p-6 h-fit"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)'
        }}
      >
        <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-color)' }}>Order Summary</h3>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between text-sm py-2">
            <span style={{ color: 'var(--text-color)' }}>{item.qty}x {item.name}</span>
            <span style={{ color: 'var(--text-color)' }}>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-white/10 pt-3 mt-3">
          <div className="flex justify-between font-bold" style={{ color: 'var(--text-color)' }}>
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}