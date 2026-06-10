// src/pages/preview/shopping-cart/ShoppingCart.jsx
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';

export default function ShoppingCart({ cart, removeFromCart, updateQty, cartTotal, setActiveTab }) {
  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='10'%3ENo Image%3C/text%3E%3C/svg%3E";

  if (cart.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>Your cart is empty</h2>
        <p className="text-white/60 mb-6">Looks like you haven't added any items yet</p>
        <button 
          onClick={() => setActiveTab('Home')} 
          style={{ backgroundColor: 'var(--button-bg)' }}
          className="text-white px-6 py-2 rounded-full font-semibold transition hover:opacity-90"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {cart.map(item => (
          <div 
            key={item.id} 
            className="rounded-2xl p-4 flex gap-4 flex-wrap sm:flex-nowrap items-center"
            style={{ 
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)'
            }}
          >
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-20 h-20 object-cover rounded-xl"
              onError={(e) => {
                e.target.src = fallbackImage;
                e.target.onerror = null;
              }}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg" style={{ color: 'var(--text-color)' }}>{item.name}</h3>
              <p className="text-white/40 text-sm">{item.unit}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="bg-white/20 p-1 rounded-full hover:bg-white/30 transition cursor-pointer">
                    <FiMinus className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-white w-8 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="bg-white/20 p-1 rounded-full hover:bg-white/30 transition cursor-pointer">
                    <FiPlus className="w-4 h-4 text-white" />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 transition cursor-pointer">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold" style={{ color: 'var(--text-color)' }}>${(item.price * item.qty).toFixed(2)}</div>
              <div className="text-white/40 text-sm">${item.price} each</div>
            </div>
          </div>
        ))}
      </div>
      
      <div 
        className="rounded-2xl p-6 h-fit"
        style={{ 
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)'
        }}
      >
        <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-color)' }}>Order Summary</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-color)' }}>Subtotal</span>
            <span style={{ color: 'var(--text-color)' }}>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Delivery Fee</span>
            <span>Free</span>
          </div>
          <div className="border-t border-white/10 pt-3 mt-2">
            <div className="flex justify-between font-bold" style={{ color: 'var(--text-color)' }}>
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('Checkout')} 
          style={{ backgroundColor: 'var(--button-bg)' }}
          className="w-full py-3 rounded-full text-white font-semibold transition cursor-pointer hover:opacity-90"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}