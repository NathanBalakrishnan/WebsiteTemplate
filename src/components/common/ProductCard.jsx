// src/components/common/ProductCard.jsx
export default function ProductCard({ product, addToCart, navigate }) {
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  
  const fallbackImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
  
  const handleProductClick = () => {
    if (navigate) {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div 
      className="rounded-2xl overflow-hidden hover:transform hover:-translate-y-2 transition-all duration-300"
      style={{ 
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)'
      }}
    >
      <div className="relative cursor-pointer" onClick={handleProductClick}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = fallbackImage;
            e.target.onerror = null;
          }}
        />
        {product.organic && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">Organic</span>
        )}
        {product.oldPrice && product.oldPrice > product.price && (
          <span className="absolute bottom-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">-{discount}%</span>
        )}
      </div>
      <div className="p-4">
        <h3 
          className="font-semibold text-lg mb-1 cursor-pointer hover:opacity-80 transition"
          style={{ color: 'var(--text-color)' }}
          onClick={handleProductClick}
        >
          {product.name}
        </h3>
        <p className="text-white/40 text-sm mb-2">{product.category}</p>
        <div className="flex items-center gap-2 mb-3">
          <span className="font-bold text-xl" style={{ color: 'var(--accent-color)' }}>
            ${product.price?.toFixed(2)}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-white/40 line-through text-sm">${product.oldPrice?.toFixed(2)}</span>
          )}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }} 
          className="w-full py-2 rounded-xl font-semibold transition cursor-pointer hover:opacity-90"
          style={{ backgroundColor: 'var(--button-bg)', color: 'white' }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}