// src/pages/preview/Home.jsx
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard";
import DynamicIcon from "../../components/common/DynamicIcon";

export default function Home({
  data,
  styles,
  isOverlayDesign = false,
  isShoppingCart = false,
  accentColor,
  primaryColor,
  descriptionColor,
  buttonBg,
  addToCart,
  searchQuery,
  setSearch,
  navigate,
}) {
  // TEMPLATE 3: SHOPPING CART DESIGN
  if (isShoppingCart) {
    const products = data?.products || [];
    const categories = data?.categories || [];
    const stats = data?.stats || { products: 0, customers: 0, stores: 0 };
    const icons = data?.icons;
    const shoppingContent = data?.shoppingContent || {};
    const filteredProducts = products.filter((product) => {
      if (!product) return false;
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes((searchQuery || "").toLowerCase());
      return matchesSearch;
    });

    return (
      <div className="animate-fade-in-up">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {shoppingContent.heroTitle || "Organic Foods at your Doorsteps"}
          </h1>
          <p className="text-white/60 text-lg mb-8">
            {shoppingContent.heroSubtitle ||
              "Fresh, healthy, and delicious groceries delivered to your home"}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              className="px-8 py-3 rounded-full text-white font-semibold transition-all hover:scale-105 cursor-pointer border-none"
              style={{ backgroundColor: "var(--button-bg)" }}
              onClick={() => {
                const element = document.getElementById("products-section");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {shoppingContent.buttonStart || "START SHOPPING"}
            </button>
            <button className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-sm text-white font-semibold hover:bg-white/20 transition-all cursor-pointer border-none">
              {shoppingContent.buttonJoin || "JOIN NOW"}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl">
            <DynamicIcon
              name={icons?.productIcon}
              size={28}
              className="mx-auto mb-3"
              style={{ color: accentColor }}
            />
            <div
              className="text-3xl font-bold"
              style={{ color: "var(--text-color)" }}
            >
              {stats.products?.toLocaleString() || 0}+
            </div>
            <div className="text-white/60 text-sm">
              {shoppingContent.stat1Label || "PRODUCTS"}
            </div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl">
            <DynamicIcon
              name={icons?.customerIcon}
              size={28}
              className="mx-auto mb-3"
              style={{ color: accentColor }}
            />
            <div
              className="text-3xl font-bold"
              style={{ color: "var(--text-color)" }}
            >
              {stats.customers?.toLocaleString() || 0}+
            </div>
            <div className="text-white/60 text-sm">
              {shoppingContent.stat2Label || "HAPPY CUSTOMERS"}
            </div>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl">
            <DynamicIcon
              name={icons?.storeIcon}
              size={28}
              className="mx-auto mb-3"
              style={{ color: accentColor }}
            />
            <div
              className="text-3xl font-bold"
              style={{ color: "var(--text-color)" }}
            >
              {stats.stores || 0}+
            </div>
            <div className="text-white/60 text-sm">
              {shoppingContent.stat3Label || "STORES"}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {setSearch && (
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder={
                  shoppingContent.searchPlaceholder || "Search products..."
                }
                value={searchQuery || ""}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/20 text-white px-4 py-3 rounded-full border border-white/20 focus:outline-none focus:border-accent placeholder:text-white/50 pl-12"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Categories Section */}
        {categories.length > 0 && (
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--text-color)" }}
              >
                {shoppingContent.categoriesTitle || "Shop by Category"}
              </h2>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-sm cursor-pointer bg-transparent border-none"
                style={{ color: "var(--accent-color)" }}
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() =>
                    navigate(`/category/${encodeURIComponent(category.name)}`)
                  }
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center cursor-pointer hover:transform hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="text-5xl mb-2">{category.icon}</div>
                  <div className="font-medium text-white">{category.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        <div id="products-section">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <h2
              className="text-2xl font-bold"
              style={{ color: "var(--text-color)" }}
            >
              {searchQuery
                ? `Search Results (${filteredProducts.length})`
                : shoppingContent.productsTitle || "Featured Products"}
            </h2>
            {searchQuery && (
              <div className="text-white/60 text-sm">
                Found {filteredProducts.length} products
              </div>
            )}
          </div>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-2xl">
              <p className="text-white/60">
                No products found. Try searching for something else!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
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
      </div>
    );
  }

  // TEMPLATE 2: OVERLAY DESIGN (full-page) – with responsive top spacing
  if (isOverlayDesign) {
    const defaultImage =
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
    const heroImage =
      data?.image && data.image.trim() !== "" ? data.image : defaultImage;

    return (
      <div className="mt-16 lg:mt-12 md:mt-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1
              className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              style={{ color: accentColor || primaryColor || "#1e3a8a" }}
            >
              {data?.tagline}
            </h1>
            <p
              className="text-lg mb-8 leading-relaxed"
              style={{ color: descriptionColor || "#d1d5db" }}
            >
              {data?.description}
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              {data?.primaryCta && (
                <button
                  className="px-8 py-3 rounded-lg hover:opacity-90 transition-all font-medium cursor-pointer"
                  style={{
                    backgroundColor: buttonBg || primaryColor || "#1e3a8a",
                    color: "white",
                  }}
                >
                  {data.primaryCta}
                </button>
              )}
              {data?.secondaryCta && (
                <button className="px-8 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium cursor-pointer">
                  {data.secondaryCta}
                </button>
              )}
            </div>
          </div>
          <div className="flex-1">
            <img
              src={heroImage}
              alt="Hero"
              className="w-full rounded-2xl shadow-2xl border-2 border-white/20 hover:border-white/40 hover:scale-105 transition-all duration-300 hover:rotate-2 cursor-pointer"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // TEMPLATE 1: EDUCATIONAL DESIGN (header-footer)
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <h1
        className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
        style={{ color: primaryColor || "#1e3a8a" }}
      >
        {data?.title || data?.tagline}
      </h1>
      <p
        className="text-lg lg:text-xl mb-10 leading-relaxed max-w-2xl mx-auto"
        style={{ color: descriptionColor || "#4b5563" }}
      >
        {data?.subtitle || data?.description}
      </p>
      <button
        className="px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer"
        style={{
          backgroundColor: buttonBg || primaryColor || "#1e3a8a",
          color: "white",
        }}
      >
        {data?.cta || data?.primaryCta || "Explore Our Programs"}
      </button>
    </div>
  );
}