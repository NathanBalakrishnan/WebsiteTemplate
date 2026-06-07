import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import siteData from '../../data/multisiteData.json';
import Navbar from '../../components/Navbar';
import Home from '../preview/Home';
import About from '../preview/About';
import Courses from '../preview/Courses';
import Achievements from '../preview/Achievements';
import Contact from '../preview/Contact';
import ShoppingCart from '../preview/shopping-cart/ShoppingCart';
import ShoppingCheckout from '../preview/shopping-cart/ShoppingCheckout';
import ProductDetail from '../preview/shopping-cart/ProductDetail';
import CategoryPage from '../preview/shopping-cart/CategoryPage';
import CustomizationPanel from '../../pages/customized/CustomizationPanel';
import "../../assets/css/PreviewTemplate.css";

export default function CustomizedParent() {
  const [activeTab, setActiveTab] = useState('Home');
  const [theme, setTheme] = useState('classic');
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [customColors, setCustomColors] = useState({
    primaryColor: '',
    accentColor: '',
    textColor: '',
    descriptionColor: '',
    buttonBg: '',
    cardBg: '',
    cardBorder: '',
    headerBg: '',
    footerBg: '',
    logoColor: '',
    menuColor: '',
    menuHoverColor: '',
    overlayBg: ''
  });

  const [textOverrides, setTextOverrides] = useState({
    homeTagline: '',
    homeDescription: '',
    homeSubtitle: '',
    homePrimaryCta: '',
    aboutTitle: '',
    aboutVision: '',
    aboutLeadership: '',
    aboutHistory: '',
    aboutCampusLife: '',
    coursesTitle: '',
    coursesEngineering: '',
    coursesManagement: '',
    coursesDataScience: '',
    coursesDesign: '',
    achievementsTitle: '',
    achievementsList: [],
    contactTitle: '',
    contactAddress: '',
    contactPhone: '',
    contactEmail: '',
    navigationItems: [],
    shoppingHeroTitle: '',
    shoppingHeroSubtitle: '',
    shoppingButtonStart: '',
    shoppingButtonJoin: '',
    shoppingCategoriesTitle: '',
    shoppingProductsTitle: '',
    shoppingSearchPlaceholder: '',
    shoppingStat1Label: '',
    shoppingStat2Label: '',
    shoppingStat3Label: '',
    statProducts: 0,
    statCustomers: 0,
    statStores: 0,
    categories: [],
    products: [],
  });

  const location = useLocation();
  const navigate = useNavigate();
  const previewRef = useRef(null);

  const selectedTemplateId = location.state?.templateId;
  const selectedTemplate = siteData.find(
    (template) => template.templateId === selectedTemplateId
  );

  useEffect(() => {
    if (selectedTemplate?.themes?.[0]) {
      setTheme(selectedTemplate.themes[0].id);
    }
  }, [selectedTemplate]);

  // Cart functionality
  useEffect(() => {
    const saved = localStorage.getItem(`cart_${selectedTemplateId}`);
    if (saved) setCart(JSON.parse(saved));
  }, [selectedTemplateId]);

  useEffect(() => {
    if (selectedTemplate?.themeScope === 'shopping-cart') {
      localStorage.setItem(`cart_${selectedTemplateId}`, JSON.stringify(cart));
    }
  }, [cart, selectedTemplateId, selectedTemplate]);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(item => item.id === id ? { ...item, qty } : item));
    }
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (!selectedTemplate) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center p-8">
          <h1 className="text-2xl mb-4">No template selected</h1>
        </div>
      </div>
    );
  }

  const themeScope = selectedTemplate.themeScope || "full-page";
  const currentThemeData = selectedTemplate.themes?.find(t => t.id === theme);

  const defaultColors = {
    overlayBg: currentThemeData?.overlayBg || "rgba(0,0,0,0.5)",
    accentColor: currentThemeData?.accentColor || (theme === 'teal' ? '#14b8a6' : theme === 'purple' ? '#8b5cf6' : '#f97316'),
    headerBg: currentThemeData?.headerBg || (selectedTemplate.styles?.navbar?.background || "#16275B"),
    footerBg: currentThemeData?.footerBg || (selectedTemplate.styles?.navbar?.background || "#16275B"),
    logoColor: currentThemeData?.logoColor || "#FFFFFF",
    menuColor: currentThemeData?.menuColor || "#FFFFFF",
    menuHoverColor: currentThemeData?.menuHoverColor || "#38BDF8",
    primaryColor: currentThemeData?.primaryColor || "#1e3a8a",
    secondaryColor: currentThemeData?.secondaryColor || "#3b82f6",
    textColor: currentThemeData?.textColor || "#1f2937",
    descriptionColor: currentThemeData?.descriptionColor || "#4b5563",
    cardBg: currentThemeData?.cardBg || "#ffffff",
    cardBorder: currentThemeData?.cardBorder || "#e2e8f0",
    buttonBg: currentThemeData?.buttonBg || (theme === 'teal' ? '#14b8a6' : theme === 'purple' ? '#8b5cf6' : '#f97316')
  };

  useEffect(() => {
    setCustomColors(defaultColors);
    applyColorVariables(defaultColors);
  }, [theme, selectedTemplate]);

  // Function to apply all color variables
  const applyColorVariables = (colors) => {
    document.documentElement.style.setProperty('--accent-color', colors.accentColor || '#14b8a6');
    document.documentElement.style.setProperty('--button-bg', colors.buttonBg || '#14b8a6');
    document.documentElement.style.setProperty('--text-color', colors.textColor || '#1f2937');
    document.documentElement.style.setProperty('--card-bg', colors.cardBg || 'rgba(255,255,255,0.1)');
    document.documentElement.style.setProperty('--card-border', colors.cardBorder || 'rgba(255,255,255,0.2)');
  };

  const handleColorChange = (colorKey, value) => {
    setCustomColors(prev => {
      const newColors = { ...prev, [colorKey]: value };
      // Immediately apply CSS variable for the changed color
      if (colorKey === 'accentColor') {
        document.documentElement.style.setProperty('--accent-color', value);
      }
      if (colorKey === 'buttonBg') {
        document.documentElement.style.setProperty('--button-bg', value);
      }
      if (colorKey === 'textColor') {
        document.documentElement.style.setProperty('--text-color', value);
      }
      if (colorKey === 'cardBg') {
        document.documentElement.style.setProperty('--card-bg', value);
      }
      if (colorKey === 'cardBorder') {
        document.documentElement.style.setProperty('--card-border', value);
      }
      return newColors;
    });
  };

  const handleReset = () => {
    setCustomColors(defaultColors);
    setTextOverrides({
      homeTagline: '',
      homeDescription: '',
      homeSubtitle: '',
      homePrimaryCta: '',
      aboutTitle: '',
      aboutVision: '',
      aboutLeadership: '',
      aboutHistory: '',
      aboutCampusLife: '',
      coursesTitle: '',
      coursesEngineering: '',
      coursesManagement: '',
      coursesDataScience: '',
      coursesDesign: '',
      achievementsTitle: '',
      achievementsList: [],
      contactTitle: '',
      contactAddress: '',
      contactPhone: '',
      contactEmail: '',
      navigationItems: [],
      shoppingHeroTitle: '',
      shoppingHeroSubtitle: '',
      shoppingButtonStart: '',
      shoppingButtonJoin: '',
      shoppingCategoriesTitle: '',
      shoppingProductsTitle: '',
      shoppingSearchPlaceholder: '',
      shoppingStat1Label: '',
      shoppingStat2Label: '',
      shoppingStat3Label: '',
      statProducts: 0,
      statCustomers: 0,
      statStores: 0,
      categories: [],
      products: [],
    });
    applyColorVariables(defaultColors);
  };

  const handleTextChangeFromPanel = (field, value) => {
    setTextOverrides(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const overlayBg = customColors.overlayBg || defaultColors.overlayBg;
  const accentColor = customColors.accentColor || defaultColors.accentColor;
  const headerBg = customColors.headerBg || defaultColors.headerBg;
  const footerBg = customColors.footerBg || defaultColors.footerBg;
  const logoColor = customColors.logoColor || defaultColors.logoColor;
  const menuColor = customColors.menuColor || defaultColors.menuColor;
  const menuHoverColor = customColors.menuHoverColor || defaultColors.menuHoverColor;
  const primaryColor = customColors.primaryColor || defaultColors.primaryColor;
  const textColor = customColors.textColor || defaultColors.textColor;
  const descriptionColor = customColors.descriptionColor || defaultColors.descriptionColor;
  const cardBg = customColors.cardBg || defaultColors.cardBg;
  const cardBorder = customColors.cardBorder || defaultColors.cardBorder;
  const buttonBg = customColors.buttonBg || defaultColors.buttonBg;

  // Apply CSS variables whenever they change
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--button-bg', buttonBg);
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--card-bg', cardBg);
    document.documentElement.style.setProperty('--card-border', cardBorder);
  }, [accentColor, buttonBg, textColor, cardBg, cardBorder]);

  useEffect(() => {
    if (themeScope === "full-page" || themeScope === "shopping-cart") {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, themeScope]);

  const isOverlayDesign = themeScope === "full-page";
  const isShoppingCart = themeScope === "shopping-cart";

  // Prepare shopping content data with overrides
  const shoppingContentData = {
    ...selectedTemplate.shoppingContent,
    heroTitle: textOverrides.shoppingHeroTitle || selectedTemplate.shoppingContent?.heroTitle || "Organic Foods at your Doorsteps",
    heroSubtitle: textOverrides.shoppingHeroSubtitle || selectedTemplate.shoppingContent?.heroSubtitle || "Fresh, healthy, and delicious groceries delivered to your home",
    buttonStart: textOverrides.shoppingButtonStart || selectedTemplate.shoppingContent?.buttonStart || "START SHOPPING",
    buttonJoin: textOverrides.shoppingButtonJoin || selectedTemplate.shoppingContent?.buttonJoin || "JOIN NOW",
    categoriesTitle: textOverrides.shoppingCategoriesTitle || selectedTemplate.shoppingContent?.categoriesTitle || "Shop by Category",
    productsTitle: textOverrides.shoppingProductsTitle || selectedTemplate.shoppingContent?.productsTitle || "Featured Products",
    searchPlaceholder: textOverrides.shoppingSearchPlaceholder || selectedTemplate.shoppingContent?.searchPlaceholder || "Search products...",
    stat1Label: textOverrides.shoppingStat1Label || selectedTemplate.shoppingContent?.stat1Label || "PRODUCTS",
    stat2Label: textOverrides.shoppingStat2Label || selectedTemplate.shoppingContent?.stat2Label || "HAPPY CUSTOMERS",
    stat3Label: textOverrides.shoppingStat3Label || selectedTemplate.shoppingContent?.stat3Label || "STORES",
  };

  const statsData = {
    products: textOverrides.statProducts !== 0 ? textOverrides.statProducts : (selectedTemplate.stats?.products || 9000),
    customers: textOverrides.statCustomers !== 0 ? textOverrides.statCustomers : (selectedTemplate.stats?.customers || 50000),
    stores: textOverrides.statStores !== 0 ? textOverrides.statStores : (selectedTemplate.stats?.stores || 25),
  };

  const categoriesData = textOverrides.categories?.length ? textOverrides.categories : selectedTemplate.categories;
  const productsData = textOverrides.products?.length ? textOverrides.products : selectedTemplate.products;

  const mergedShoppingTemplate = {
    ...selectedTemplate,
    shoppingContent: shoppingContentData,
    stats: statsData,
    categories: categoriesData,
    products: productsData,
  };

  // Prepare data with text overrides for educational/overlay templates
  const homeData = {
    ...selectedTemplate.home,
    tagline: textOverrides.homeTagline || selectedTemplate.home?.tagline,
    description: textOverrides.homeDescription || selectedTemplate.home?.description,
    subtitle: textOverrides.homeSubtitle || selectedTemplate.home?.subtitle,
    primaryCta: textOverrides.homePrimaryCta || selectedTemplate.home?.primaryCta || selectedTemplate.home?.cta,
  };

  const aboutData = {
    ...selectedTemplate.about,
    title: textOverrides.aboutTitle || selectedTemplate.about?.title,
    sections: {
      'Our Vision': textOverrides.aboutVision || selectedTemplate.about?.sections?.['Our Vision'],
      'Leadership': textOverrides.aboutLeadership || selectedTemplate.about?.sections?.['Leadership'],
      'History': textOverrides.aboutHistory || selectedTemplate.about?.sections?.['History'],
      'Campus Life': textOverrides.aboutCampusLife || selectedTemplate.about?.sections?.['Campus Life'],
    }
  };

  const coursesData = {
    ...selectedTemplate.courses,
    title: textOverrides.coursesTitle || selectedTemplate.courses?.title,
    details: {
      'Engineering': textOverrides.coursesEngineering || selectedTemplate.courses?.details?.['Engineering'],
      'Management': textOverrides.coursesManagement || selectedTemplate.courses?.details?.['Management'],
      'Data Science': textOverrides.coursesDataScience || selectedTemplate.courses?.details?.['Data Science'],
      'Design': textOverrides.coursesDesign || selectedTemplate.courses?.details?.['Design'],
    }
  };

  const achievementsData = {
    ...selectedTemplate.achievements,
    title: textOverrides.achievementsTitle || selectedTemplate.achievements?.title,
    list: textOverrides.achievementsList.length ? textOverrides.achievementsList : selectedTemplate.achievements?.list,
  };

  const contactData = {
    ...selectedTemplate.contact,
    title: textOverrides.contactTitle || selectedTemplate.contact?.title,
    address: textOverrides.contactAddress || selectedTemplate.contact?.address,
    phone: textOverrides.contactPhone || selectedTemplate.contact?.phone,
    email: textOverrides.contactEmail || selectedTemplate.contact?.email,
  };

  const navigationData = textOverrides.navigationItems.length ? textOverrides.navigationItems : selectedTemplate.navigation;

  const renderContent = () => {
    if (isShoppingCart) {
      switch(activeTab) {
        case 'Home':
          return (
            <Home 
              data={mergedShoppingTemplate}
              isShoppingCart={true}
              accentColor={accentColor}
              addToCart={addToCart}
              searchQuery={search}
              setSearch={setSearch}
              navigate={navigate}
            />
          );
        case 'Cart':
          return (
            <ShoppingCart 
              cart={cart}
              removeFromCart={removeFromCart}
              updateQty={updateQty}
              cartTotal={cartTotal}
              setActiveTab={setActiveTab}
              accentColor={accentColor}
            />
          );
        case 'Checkout':
          return (
            <ShoppingCheckout 
              cart={cart}
              cartTotal={cartTotal}
              clearCart={clearCart}
              setActiveTab={setActiveTab}
              accentColor={accentColor}
            />
          );
        default:
          return (
            <Home 
              data={mergedShoppingTemplate}
              isShoppingCart={true}
              accentColor={accentColor}
              addToCart={addToCart}
              searchQuery={search}
              setSearch={setSearch}
              navigate={navigate}
            />
          );
      }
    }
    
    if (isOverlayDesign) {
      switch(activeTab) {
        case 'Home':
          return (
            <Home 
              data={homeData}
              styles={selectedTemplate.styles?.home}
              isOverlayDesign={true}
              accentColor={accentColor}
              primaryColor={primaryColor}
              descriptionColor={descriptionColor}
              buttonBg={buttonBg}
              navigate={navigate}
            />
          );
        case 'About Us':
          return (
            <About 
              data={aboutData}
              styles={selectedTemplate.styles?.about}
              isOverlayDesign={true}
              accentColor={accentColor}
              primaryColor={primaryColor}
              textColor="#ffffff"
              cardBg="rgba(255,255,255,0.1)"
              cardBorder="rgba(255,255,255,0.2)"
            />
          );
        case 'Courses':
          return (
            <Courses 
              data={coursesData}
              styles={selectedTemplate.styles?.courses}
              isOverlayDesign={true}
              accentColor={accentColor}
              primaryColor={primaryColor}
              textColor="#ffffff"
              cardBg="rgba(255,255,255,0.1)"
              cardBorder="rgba(255,255,255,0.2)"
            />
          );
        case 'Achievements':
          return (
            <Achievements 
              data={achievementsData}
              styles={selectedTemplate.styles?.achievements}
              isOverlayDesign={true}
              accentColor={accentColor}
              primaryColor={primaryColor}
              textColor="#ffffff"
              cardBg="rgba(255,255,255,0.1)"
              cardBorder="rgba(255,255,255,0.2)"
            />
          );
        case 'Contact':
          return (
            <Contact 
              data={contactData}
              styles={selectedTemplate.styles?.contact}
              isOverlayDesign={true}
              accentColor={accentColor}
              primaryColor={primaryColor}
              textColor="#ffffff"
              cardBg="rgba(255,255,255,0.1)"
              cardBorder="rgba(255,255,255,0.2)"
            />
          );
        default:
          return (
            <Home 
              data={homeData}
              styles={selectedTemplate.styles?.home}
              isOverlayDesign={true}
              accentColor={accentColor}
              primaryColor={primaryColor}
              descriptionColor={descriptionColor}
              buttonBg={buttonBg}
              navigate={navigate}
            />
          );
      }
    }
    
    // EDUCATIONAL TEMPLATE
    switch(activeTab) {
      case 'Home':
        return (
          <Home 
            data={homeData}
            styles={selectedTemplate.styles?.home}
            isOverlayDesign={false}
            primaryColor={primaryColor}
            descriptionColor={descriptionColor}
            buttonBg={buttonBg}
            navigate={navigate}
          />
        );
      case 'About Us':
        return (
          <About 
            data={aboutData}
            styles={selectedTemplate.styles?.about}
            isOverlayDesign={false}
            primaryColor={primaryColor}
            textColor={textColor}
            cardBg={cardBg}
            cardBorder={cardBorder}
          />
        );
      case 'Courses':
        return (
          <Courses 
            data={coursesData}
            styles={selectedTemplate.styles?.courses}
            isOverlayDesign={false}
            primaryColor={primaryColor}
            textColor={textColor}
            cardBg={cardBg}
            cardBorder={cardBorder}
          />
        );
      case 'Achievements':
        return (
          <Achievements 
            data={achievementsData}
            styles={selectedTemplate.styles?.achievements}
            isOverlayDesign={false}
            primaryColor={primaryColor}
            textColor={textColor}
            cardBg={cardBg}
            cardBorder={cardBorder}
          />
        );
      case 'Contact':
        return (
          <Contact 
            data={contactData}
            styles={selectedTemplate.styles?.contact}
            isOverlayDesign={false}
            primaryColor={primaryColor}
            textColor={textColor}
            cardBg={cardBg}
            cardBorder={cardBorder}
          />
        );
      default:
        return (
          <Home 
            data={homeData}
            styles={selectedTemplate.styles?.home}
            isOverlayDesign={false}
            primaryColor={primaryColor}
            descriptionColor={descriptionColor}
            buttonBg={buttonBg}
            navigate={navigate}
          />
        );
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
    }}>
      <CustomizationPanel
        isOverlayDesign={isOverlayDesign}
        customColors={{
          accentColor,
          overlayBg,
          buttonBg,
          cardBg,
          cardBorder,
          textColor,
          descriptionColor,
          logoColor,
          menuColor,
          menuHoverColor,
          primaryColor,
          headerBg,
          footerBg
        }}
        onColorChange={handleColorChange}
        onReset={handleReset}
        templateData={selectedTemplate}
        onTextChange={handleTextChangeFromPanel}
      />

      <div
        ref={previewRef}
        style={{
          flex: 1,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          contain: 'layout',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isShoppingCart && (
          <>
            <div style={{
              position: 'fixed', inset: 0,
              backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920')",
              backgroundSize: 'cover', backgroundPosition: 'center',
              zIndex: 0,
            }} />
            <div style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 1,
            }} />
          </>
        )}

        {isOverlayDesign && (
          <>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${selectedTemplate.home?.image})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              zIndex: 0, pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              backgroundColor: overlayBg,
              zIndex: 1, pointerEvents: 'none',
            }} />
          </>
        )}

        <div style={{
          flexShrink: 0,
          width: '100%',
          position: 'relative',
          zIndex: 100,
        }}>
          <Navbar
            navData={navigationData}
            themesData={selectedTemplate.themes || []}
            activeTab={activeTab}
            templateData={selectedTemplate}
            setActiveTab={setActiveTab}
            currentTheme={theme}
            setTheme={setTheme}
            themeScope={themeScope}
            headerBg={headerBg}
            logoColor={logoColor}
            menuColor={menuColor}
            menuHoverColor={menuHoverColor}
            isOverlayDesign={isOverlayDesign || isShoppingCart}
            accentColor={accentColor}
            isShoppingCart={isShoppingCart}
            cartCount={cartCount}
            search={search}
            setSearch={setSearch}
          />
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          zIndex: 2,
        }}>
          <div className={`min-h-full flex flex-col ${!isOverlayDesign && !isShoppingCart ? 'bg-white' : ''}`}>
            <main className={`flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 ${
              isOverlayDesign ? 'relative z-20 max-w-7xl pt-8' : 
              isShoppingCart ? 'relative z-20 max-w-6xl pt-28 md:pt-32' : 
              'max-w-6xl pt-8'
            }`}>
              <div key={activeTab} className="w-full">
                {renderContent()}
              </div>
            </main>

            <footer
              className="w-full py-6 mt-auto transition-all duration-300"
              style={{
                backgroundColor: isOverlayDesign ? 'rgba(0,0,0,0.8)' : 
                               isShoppingCart ? 'transparent' : footerBg,
                borderTop: (isOverlayDesign || isShoppingCart) ? '1px solid rgba(255,255,255,0.1)' : 'none',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs tracking-wide ${
                (isOverlayDesign || isShoppingCart) ? 'text-white/40' : 'text-white/70'
              }`}>
                © {new Date().getFullYear()} {selectedTemplate.title}. All rights reserved.
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}