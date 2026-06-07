import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';

export default function ProductDetail({ products, addToCart, setActiveTab }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find product by id
    const foundProduct = products?.find(p => p.id === parseInt(id));
    setProduct(foundProduct);
    setLoading(false);
  }, [id, products]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Optionally go to cart or show notification
    if (setActiveTab) {
      setActiveTab('Cart');
    } else {
      navigate('/cart');
    }
  };

  const handleGoBack = () => {
    if (setActiveTab) {
      setActiveTab('Home');
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-white mb-4">Product Not Found</h2>
        <p className="text-white/60 mb-6">The product you're looking for doesn't exist.</p>
        <button 
          onClick={handleGoBack}
          className="px-6 py-2 rounded-full text-white font-semibold transition cursor-pointer"
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          Back to Shopping
        </button>
      </div>
    );
  }

  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back Button */}
      <button 
        onClick={handleGoBack}
        className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition cursor-pointer bg-transparent border-none"
      >
        <FiArrowLeft /> Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image Section */}
        <div className="relative">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=Product+Image';
              }}
            />
          </div>
          {product.organic && (
            <span className="absolute top-4 left-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
              Organic
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Product Info Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {product.name}
          </h1>
          
          <p className="text-white/50 text-sm mb-3">{product.category}</p>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={`text-sm ${i < (product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`}
                />
              ))}
            </div>
            <span className="text-white/50 text-sm">({product.rating || 0} stars)</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-white/40 line-through text-lg mr-3">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
            <span className="text-3xl md:text-4xl font-bold text-accent">
              ${product.price?.toFixed(2)}
            </span>
            <span className="text-white/40 text-sm ml-2">/ {product.unit || 'unit'}</span>
          </div>

          {/* Description */}
          <p className="text-white/70 mb-6 leading-relaxed">
            {product.description || `Fresh and high-quality ${product.name.toLowerCase()} sourced directly from local farms. ${product.organic ? '100% organic and chemical-free.' : 'Premium quality guaranteed.'}`}
          </p>

          {/* Product Details */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-sm">Unit:</span>
              <span className="text-white font-medium">{product.unit || '1 pc'}</span>
            </div>
            {product.organic && (
              <div className="flex items-center gap-2">
                <span className="text-white/50 text-sm">Certification:</span>
                <span className="text-green-400 font-medium">USDA Organic</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-sm">Stock Status:</span>
              <span className="text-green-400 font-medium">In Stock</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="text-white font-medium mb-2 block">Quantity</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-white hover:text-accent transition cursor-pointer p-1"
                >
                  <FiMinus />
                </button>
                <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-white hover:text-accent transition cursor-pointer p-1"
                >
                  <FiPlus />
                </button>
              </div>
              <span className="text-white/40 text-sm">
                Total: ${(product.price * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className="flex-1 py-3 rounded-full text-white font-semibold transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <FiHeart className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-white font-semibold mb-3">Product Highlights</h3>
            <ul className="space-y-2 text-white/60 text-sm">
              <li>✓ Freshly sourced from local farms</li>
              <li>✓ {product.organic ? '100% Organic Certified' : 'Premium Quality'}</li>
              <li>✓ Free delivery on orders over $50</li>
              <li>✓ 100% Satisfaction Guarantee</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}