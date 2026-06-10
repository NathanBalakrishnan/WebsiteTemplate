import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import siteData from "../../data/multisiteData.json";
import Navbar from "../../components/Navbar";
import Home from "./Home";
import About from "./About";
import Courses from "./Courses";
import Achievements from "./Achievements";
import Contact from "./Contact";
import ShoppingCart from "./shopping-cart/ShoppingCart";
import ShoppingCheckout from "./shopping-cart/ShoppingCheckout";
import ProductDetail from "./shopping-cart/ProductDetail";
import CategoryPage from "./shopping-cart/CategoryPage";
import "../../assets/css/PreviewTemplate.css";

export default function PreviewParent() {
  const [activeTab, setActiveTab] = useState("Home");
  const [theme, setTheme] = useState("classic");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { templateId: paramTemplateId } = useParams();

  // Get template ID from either state or URL params
  const selectedTemplateId = location.state?.templateId || paramTemplateId;
  
  console.log("PreviewParent - Selected Template ID:", selectedTemplateId);
  
  const selectedTemplate = siteData.find(
    (template) => template.templateId === parseInt(selectedTemplateId)
  );

  // Define themeScope early so it can be used
  const themeScope = selectedTemplate?.themeScope || "full-page";
  
  // Define isOverlayDesign and isShoppingCart BEFORE using them in useEffect
  const isOverlayDesign = themeScope === "full-page";
  const isShoppingCart = themeScope === "shopping-cart";

  useEffect(() => {
    if (selectedTemplate?.themes?.[0]) {
      setTheme(selectedTemplate.themes[0].id);
    }
  }, [selectedTemplate]);

  // Cart functionality for shopping cart template
  useEffect(() => {
    const saved = localStorage.getItem(`cart_${selectedTemplateId}`);
    if (saved) setCart(JSON.parse(saved));
  }, [selectedTemplateId]);

  useEffect(() => {
    if (selectedTemplate?.themeScope === "shopping-cart") {
      localStorage.setItem(`cart_${selectedTemplateId}`, JSON.stringify(cart));
    }
  }, [cart, selectedTemplateId, selectedTemplate]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, qty } : item)));
    }
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // If no template is found, show loading
  if (!selectedTemplate) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center p-8">
          <h1 className="text-2xl mb-4">Loading template...</h1>
          <p className="text-white/60">Template ID: {selectedTemplateId || 'Not provided'}</p>
        </div>
      </div>
    );
  }

  const currentThemeData = selectedTemplate.themes?.find((t) => t.id === theme);

  // For Template 2 (full-page theme)
  const overlayBg = currentThemeData?.overlayBg || "rgba(0,0,0,0.5)";
  const accentColor = currentThemeData?.accentColor || "#06b6d4";

  // For Template 1 (header-footer theme with body colors)
  const headerBg =
    currentThemeData?.headerBg ||
    selectedTemplate.styles?.navbar?.background ||
    "#16275B";
  const footerBg = currentThemeData?.footerBg || headerBg;
  const logoColor = currentThemeData?.logoColor || "#FFFFFF";
  const menuColor = currentThemeData?.menuColor || "#FFFFFF";
  const menuHoverColor = currentThemeData?.menuHoverColor || "#38BDF8";

  // Template 1 body theme colors
  const primaryColor = currentThemeData?.primaryColor || "#1e3a8a";
  const descriptionColor = currentThemeData?.descriptionColor || "#4b5563";
  const textColor = currentThemeData?.textColor || "#1f2937";
  const cardBg = currentThemeData?.cardBg || "#ffffff";
  const cardBorder = currentThemeData?.cardBorder || "#e2e8f0";
  const buttonBg = currentThemeData?.buttonBg || "#1e3a8a";

  // Shopping cart theme colors
  const shoppingThemeColor = currentThemeData?.accentColor || 
    (theme === 'teal' ? '#14b8a6' : theme === 'purple' ? '#8b5cf6' : '#f97316');
  
  const shoppingButtonBg = currentThemeData?.buttonBg || shoppingThemeColor;
  const shoppingTextColor = currentThemeData?.textColor || "#1f2937";
  const shoppingCardBg = currentThemeData?.cardBg || 'rgba(255,255,255,0.1)';
  const shoppingCardBorder = currentThemeData?.cardBorder || 'rgba(255,255,255,0.2)';

  // Set ALL CSS variables for the theme
  useEffect(() => {
    if (isShoppingCart) {
      // Shopping cart template variables
      document.documentElement.style.setProperty('--accent-color', shoppingThemeColor);
      document.documentElement.style.setProperty('--button-bg', shoppingButtonBg);
      document.documentElement.style.setProperty('--text-color', shoppingTextColor);
      document.documentElement.style.setProperty('--card-bg', shoppingCardBg);
      document.documentElement.style.setProperty('--card-border', shoppingCardBorder);
      document.documentElement.style.setProperty('--accent-hover', shoppingThemeColor + 'cc');
    } else if (isOverlayDesign) {
      // Overlay template variables
      document.documentElement.style.setProperty('--accent-color', accentColor);
      document.documentElement.style.setProperty('--button-bg', buttonBg);
      document.documentElement.style.setProperty('--text-color', '#ffffff');
      document.documentElement.style.setProperty('--card-bg', 'rgba(255,255,255,0.1)');
      document.documentElement.style.setProperty('--card-border', 'rgba(255,255,255,0.2)');
    } else {
      // Educational template variables
      document.documentElement.style.setProperty('--accent-color', primaryColor);
      document.documentElement.style.setProperty('--button-bg', buttonBg);
      document.documentElement.style.setProperty('--text-color', textColor);
      document.documentElement.style.setProperty('--card-bg', cardBg);
      document.documentElement.style.setProperty('--card-border', cardBorder);
    }
    
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, isShoppingCart, isOverlayDesign, shoppingThemeColor, shoppingButtonBg, shoppingTextColor, shoppingCardBg, shoppingCardBorder, accentColor, buttonBg, primaryColor, textColor, cardBg, cardBorder]);

  // Handle tab change for shopping cart
  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
  };

  // Render shopping cart content
  const renderShoppingContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <Home
            data={selectedTemplate}
            isShoppingCart={true}
            accentColor={shoppingThemeColor}
            addToCart={addToCart}
            searchQuery={search}
            setSearch={setSearch}
            navigate={navigate}
          />
        );
      case "Cart":
        return (
          <ShoppingCart
            cart={cart}
            removeFromCart={removeFromCart}
            updateQty={updateQty}
            cartTotal={cartTotal}
            setActiveTab={handleSetActiveTab}
            accentColor={shoppingThemeColor}
          />
        );
      case "Checkout":
        return (
          <ShoppingCheckout
            cart={cart}
            cartTotal={cartTotal}
            clearCart={clearCart}
            setActiveTab={handleSetActiveTab}
            accentColor={shoppingThemeColor}
          />
        );
      case "ProductDetail":
        return (
          <ProductDetail
            products={selectedTemplate.products}
            addToCart={addToCart}
            setActiveTab={handleSetActiveTab}
            accentColor={shoppingThemeColor}
          />
        );
      default:
        return (
          <Home
            data={selectedTemplate}
            isShoppingCart={true}
            accentColor={shoppingThemeColor}
            addToCart={addToCart}
            searchQuery={search}
            setSearch={setSearch}
            navigate={navigate}
          />
        );
    }
  };

  // Render educational/overlay template content
  const renderEducationalContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <Home
            data={selectedTemplate.home}
            styles={selectedTemplate.styles?.home}
            isOverlayDesign={isOverlayDesign}
            accentColor={accentColor}
            primaryColor={primaryColor}
            descriptionColor={descriptionColor}
            buttonBg={buttonBg}
            navigate={navigate}
          />
        );
      case "About Us":
        return (
          <About
            data={selectedTemplate.about}
            styles={selectedTemplate.styles?.about}
            isOverlayDesign={isOverlayDesign}
            accentColor={accentColor}
            primaryColor={primaryColor}
            textColor={isOverlayDesign ? "#ffffff" : textColor}
            cardBg={isOverlayDesign ? "rgba(255,255,255,0.1)" : cardBg}
            cardBorder={isOverlayDesign ? "rgba(255,255,255,0.2)" : cardBorder}
          />
        );
      case "Courses":
        return (
          <Courses
            data={selectedTemplate.courses}
            styles={selectedTemplate.styles?.courses}
            isOverlayDesign={isOverlayDesign}
            accentColor={accentColor}
            primaryColor={primaryColor}
            textColor={isOverlayDesign ? "#ffffff" : textColor}
            cardBg={isOverlayDesign ? "rgba(255,255,255,0.1)" : cardBg}
            cardBorder={isOverlayDesign ? "rgba(255,255,255,0.2)" : cardBorder}
          />
        );
      case "Achievements":
        return (
          <Achievements
            data={selectedTemplate.achievements}
            styles={selectedTemplate.styles?.achievements}
            isOverlayDesign={isOverlayDesign}
            accentColor={accentColor}
            primaryColor={primaryColor}
            textColor={isOverlayDesign ? "#ffffff" : textColor}
            cardBg={isOverlayDesign ? "rgba(255,255,255,0.1)" : cardBg}
            cardBorder={isOverlayDesign ? "rgba(255,255,255,0.2)" : cardBorder}
          />
        );
      case "Contact":
        return (
          <Contact
            data={selectedTemplate.contact}
            styles={selectedTemplate.styles?.contact}
            isOverlayDesign={isOverlayDesign}
            accentColor={accentColor}
            primaryColor={primaryColor}
            textColor={isOverlayDesign ? "#ffffff" : textColor}
            cardBg={isOverlayDesign ? "rgba(255,255,255,0.1)" : cardBg}
            cardBorder={isOverlayDesign ? "rgba(255,255,255,0.2)" : cardBorder}
          />
        );
      default:
        return (
          <Home
            data={selectedTemplate.home}
            styles={selectedTemplate.styles?.home}
            isOverlayDesign={isOverlayDesign}
            accentColor={accentColor}
            primaryColor={primaryColor}
            descriptionColor={descriptionColor}
            buttonBg={buttonBg}
            navigate={navigate}
          />
        );
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${!isOverlayDesign && !isShoppingCart ? "bg-white" : ""}`}
    >
      {/* Background for Template 2 (full-page) */}
      {isOverlayDesign && (
        <>
          <div
            className="fixed inset-0 z-0 bg-cover bg-center transition-all duration-700 ease-in-out"
            style={{ backgroundImage: `url(${selectedTemplate.home?.image})` }}
          />
          <div
            className="fixed inset-0 z-10 transition-colors duration-700 ease-in-out"
            style={{ backgroundColor: overlayBg }}
          />
        </>
      )}

      {/* Background for Shopping Cart Template */}
      {isShoppingCart && (
        <>
          <div
            className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920')",
            }}
          />
          <div className="fixed inset-0 z-10 bg-black/70"></div>
        </>
      )}

      <Navbar
        isShoppingCart={isShoppingCart}
        currentPage={
          isShoppingCart
            ? activeTab === "Home"
              ? "home"
              : activeTab === "Cart"
                ? "cart"
                : "home"
            : undefined
        }
        setPage={(page) => {
          if (page === "home") handleSetActiveTab("Home");
          if (page === "cart") handleSetActiveTab("Cart");
        }}
        cartCount={cartCount}
        search={search}
        setSearch={setSearch}
        navData={selectedTemplate.navigation || []}
        themesData={selectedTemplate.themes || []}
        activeTab={activeTab}
        templateData={selectedTemplate}
        setActiveTab={handleSetActiveTab}
        theme={theme}
        setTheme={setTheme}
        currentTheme={theme}
        themeScope={themeScope}
        headerBg={headerBg}
        logoColor={logoColor}
        menuColor={menuColor}
        menuHoverColor={menuHoverColor}
        isOverlayDesign={isOverlayDesign || isShoppingCart}
        accentColor={isShoppingCart ? shoppingThemeColor : accentColor}
        themes={selectedTemplate.themes}
      />

      <main
        className={`flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 ${
          isOverlayDesign
            ? "relative z-20 max-w-7xl pt-35"
            : isShoppingCart
              ? "relative z-20 max-w-6xl pt-28 md:pt-32"
              : "max-w-6xl pt-20"
        }`}
      >
        <div key={activeTab} className="w-full">
          {isShoppingCart
            ? renderShoppingContent()
            : renderEducationalContent()}
        </div>
      </main>

      <footer
        className="w-full py-6 mt-auto transition-all duration-300 relative z-20"
        style={{
          backgroundColor: isOverlayDesign
            ? "rgba(0,0,0,0.8)"
            : isShoppingCart
              ? "transparent"
              : footerBg,
          borderTop:
            isOverlayDesign || isShoppingCart
              ? "1px solid rgba(255,255,255,0.1)"
              : "none",
        }}
      >
        <div
          className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs tracking-wide ${
            isOverlayDesign || isShoppingCart
              ? "text-white/40"
              : "text-white/70"
          }`}
        >
          © {new Date().getFullYear()} {selectedTemplate.title}. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}