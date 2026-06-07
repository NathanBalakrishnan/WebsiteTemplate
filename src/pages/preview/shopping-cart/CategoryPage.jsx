// src/pages/shopping-cart/CategoryPage.jsx
import { useParams } from 'react-router-dom';
import ProductCard from '../../../components/common/ProductCard';

export default function CategoryPage({ categories, products, addToCart, setActiveTab, navigate }) {
  const { categoryName } = useParams();
  const decodedCategory = decodeURIComponent(categoryName);
  
  const category = categories?.find(c => c.name === decodedCategory);
  const categoryProducts = products?.filter(p => p.category === decodedCategory);

  const handleProductClick = (productId) => {
    if (navigate) {
      navigate(`/product/${productId}`);
    } else if (setActiveTab) {
      // Pass product id to show product detail
      window.history.pushState({}, '', `/product/${productId}`);
      setActiveTab('ProductDetail');
    }
  };

  if (!category && categoryProducts?.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-white mb-4">Category Not Found</h2>
        <button 
          onClick={() => setActiveTab ? setActiveTab('Home') : navigate('/')}
          className="px-6 py-2 rounded-full text-white font-semibold cursor-pointer"
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-10">
        <div className="text-7xl mb-3">{category?.icon || '🛒'}</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{decodedCategory}</h1>
        <p className="text-white/60">Explore our fresh and organic {decodedCategory.toLowerCase()} collection</p>
        <p className="text-white/40 text-sm mt-2">{categoryProducts?.length || 0} products available</p>
      </div>
      
      {categoryProducts?.length === 0 ? (
        <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-2xl">
          <p className="text-white/60">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts?.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              addToCart={addToCart} 
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}