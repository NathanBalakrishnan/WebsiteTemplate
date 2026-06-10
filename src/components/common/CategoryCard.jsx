// src/components/CategoryCard.jsx
export default function CategoryCard({ category, navigate }) {
  return (
    <div 
      onClick={() => navigate && navigate(`/category/${category.slug}`)} 
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center cursor-pointer hover:transform hover:-translate-y-2 transition-all duration-300"
    >
      <div className="text-5xl mb-2">{category.icon}</div>
      <div className="text-white font-medium">{category.name}</div>
    </div>
  );
}