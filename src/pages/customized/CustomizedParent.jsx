import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { openDB } from 'idb';
import siteData from '../../data/multisiteData.json';
import Navbar from '../../components/Navbar';
import Home from '../preview/Home';
import About from '../preview/About';
import Courses from '../preview/Courses';
import Achievements from '../preview/Achievements';
import Contact from '../preview/Contact';
import ShoppingCart from '../preview/shopping-cart/ShoppingCart';
import ShoppingCheckout from '../preview/shopping-cart/ShoppingCheckout';
import CustomizationPanel from './CustomizationPanel';
import { 
  saveUserCustomizedTemplate, 
  loadUserCustomizedTemplate,
  resetUserTemplate
} from '../../utils/userTemplateStorage';
import "../../assets/css/PreviewTemplate.css";

export default function CustomizedParent() {
  // ==================== STATE ====================
  const [activeTab, setActiveTab] = useState('Home');
  const [theme, setTheme] = useState('classic');
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [viewFullScreen, setViewFullScreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [customColors, setCustomColors] = useState({
    primaryColor: '', accentColor: '', textColor: '', descriptionColor: '',
    buttonBg: '', cardBg: '', cardBorder: '', headerBg: '', footerBg: '',
    logoColor: '', menuColor: '', menuHoverColor: '', overlayBg: ''
  });
  const [textOverrides, setTextOverrides] = useState({
    homeTagline: '', homeDescription: '', homeSubtitle: '', homePrimaryCta: '', homeImage: '',
    aboutTitle: '', aboutVision: '', aboutLeadership: '', aboutHistory: '', aboutCampusLife: '',
    coursesTitle: '', coursesEngineering: '', coursesManagement: '', coursesDataScience: '', coursesDesign: '',
    achievementsTitle: '', achievementsList: [],
    contactTitle: '', contactAddress: '', contactPhone: '', contactEmail: '',
    navigationItems: [],
    shoppingHeroTitle: '', shoppingHeroSubtitle: '', shoppingButtonStart: '', shoppingButtonJoin: '',
    shoppingCategoriesTitle: '', shoppingProductsTitle: '', shoppingSearchPlaceholder: '',
    shoppingStat1Label: '', shoppingStat2Label: '', shoppingStat3Label: '',
    statProducts: 0, statCustomers: 0, statStores: 0,
    categories: [], products: [],
  });

  const location = useLocation();
  const navigate = useNavigate();
  const previewRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;
  const selectedTemplateId = location.state?.templateId;
  const originalTemplate = siteData.find(t => t.templateId === selectedTemplateId);
  const [loadedTemplate, setLoadedTemplate] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ==================== FOLDER PERSISTENCE (IndexedDB) ====================
  const DB_NAME = 'TemplateApp';
  const STORE_NAME = 'folderHandle';
  let folderHandleCache = null;

  async function getFolderHandle() {
    if (folderHandleCache) return folderHandleCache;

    const db = await openDB(DB_NAME, 1, {
      upgrade(db) { db.createObjectStore(STORE_NAME); }
    });
    let savedHandle = await db.get(STORE_NAME, 'dirHandle');
    if (savedHandle && (await savedHandle.queryPermission({ mode: 'readwrite' }) === 'granted')) {
      folderHandleCache = savedHandle;
      return folderHandleCache;
    }
    folderHandleCache = await window.showDirectoryPicker();
    await db.put(STORE_NAME, folderHandleCache, 'dirHandle');
    return folderHandleCache;
  }

  // ==================== LOAD TEMPLATE ====================
  useEffect(() => {
    const loadTemplate = async () => {
      if (!originalTemplate || !userId) return;

      let folderData = null;
      try {
        const dirHandle = await getFolderHandle();
        const fileName = `template_${selectedTemplateId}_user_${userId}.json`;
        const fileHandle = await dirHandle.getFileHandle(fileName);
        const file = await fileHandle.getFile();
        const text = await file.text();
        folderData = JSON.parse(text);
      } catch (err) { /* ignore */ }

      if (folderData) {
        setLoadedTemplate(folderData);
        saveUserCustomizedTemplate(userId, selectedTemplateId, folderData);
      } else {
        const localData = loadUserCustomizedTemplate(userId, selectedTemplateId, originalTemplate);
        setLoadedTemplate(localData);
      }
    };
    loadTemplate();
  }, [originalTemplate, userId, selectedTemplateId]);

  useEffect(() => {
    if (loadedTemplate?.themes?.[0]) setTheme(loadedTemplate.themes[0].id);
  }, [loadedTemplate]);

  // ==================== CART PERSISTENCE ====================
  useEffect(() => {
    const saved = localStorage.getItem(`cart_${selectedTemplateId}_${userId || 'guest'}`);
    if (saved) setCart(JSON.parse(saved));
  }, [selectedTemplateId, userId]);

  useEffect(() => {
    if (loadedTemplate?.themeScope === 'shopping-cart') {
      localStorage.setItem(`cart_${selectedTemplateId}_${userId || 'guest'}`, JSON.stringify(cart));
    }
  }, [cart, selectedTemplateId, userId, loadedTemplate]);

  // ==================== AUTO-SAVE ====================
  useEffect(() => {
    if (!loadedTemplate || !userId || !hasUnsavedChanges) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setIsSaving(true);

    saveTimeoutRef.current = setTimeout(async () => {
      const customized = buildCustomizedTemplate();
      if (!customized) return;

      saveUserCustomizedTemplate(userId, selectedTemplateId, customized);

      try {
        const dirHandle = await getFolderHandle();
        const fileName = `template_${selectedTemplateId}_user_${userId}.json`;
        const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(customized, null, 2));
        await writable.close();
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (err) {
        console.warn('Folder save failed', err);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      }
      setIsSaving(false);
    }, 1500);

    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [theme, customColors, textOverrides, userId, selectedTemplateId, loadedTemplate, hasUnsavedChanges]);

  const markAsChanged = () => { if (!hasUnsavedChanges) setHasUnsavedChanges(true); };

  // ==================== CART FUNCTIONS ====================
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    markAsChanged();
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
    markAsChanged();
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) removeFromCart(id);
    else setCart(cart.map(item => item.id === id ? { ...item, qty } : item));
    markAsChanged();
  };

  const clearCart = () => {
    setCart([]);
    markAsChanged();
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // ==================== THEME & COLORS ====================
  const themeScope = loadedTemplate?.themeScope || "full-page";
  const isOverlayDesign = themeScope === "full-page";
  const isShoppingCart = themeScope === "shopping-cart";
  const currentThemeData = loadedTemplate?.themes?.find(t => t.id === theme);

  const defaultColors = {
    overlayBg: currentThemeData?.overlayBg || "rgba(0,0,0,0.5)",
    accentColor: currentThemeData?.accentColor || (theme === 'teal' ? '#14b8a6' : theme === 'purple' ? '#8b5cf6' : '#f97316'),
    headerBg: currentThemeData?.headerBg || (loadedTemplate?.styles?.navbar?.background || "#16275B"),
    footerBg: currentThemeData?.footerBg || (loadedTemplate?.styles?.navbar?.background || "#16275B"),
    logoColor: currentThemeData?.logoColor || "#FFFFFF",
    menuColor: currentThemeData?.menuColor || "#FFFFFF",
    menuHoverColor: currentThemeData?.menuHoverColor || "#38BDF8",
    primaryColor: currentThemeData?.primaryColor || "#1e3a8a",
    textColor: currentThemeData?.textColor || "#1f2937",
    descriptionColor: currentThemeData?.descriptionColor || "#4b5563",
    cardBg: currentThemeData?.cardBg || "#ffffff",
    cardBorder: currentThemeData?.cardBorder || "#e2e8f0",
    buttonBg: currentThemeData?.buttonBg || (theme === 'teal' ? '#14b8a6' : theme === 'purple' ? '#8b5cf6' : '#f97316')
  };

  useEffect(() => {
    if (loadedTemplate) {
      setCustomColors(defaultColors);
      applyColorVariables(defaultColors);
    }
  }, [theme, loadedTemplate]);

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
      if (colorKey === 'accentColor') document.documentElement.style.setProperty('--accent-color', value);
      if (colorKey === 'buttonBg') document.documentElement.style.setProperty('--button-bg', value);
      if (colorKey === 'textColor') document.documentElement.style.setProperty('--text-color', value);
      if (colorKey === 'cardBg') document.documentElement.style.setProperty('--card-bg', value);
      if (colorKey === 'cardBorder') document.documentElement.style.setProperty('--card-border', value);
      return newColors;
    });
    markAsChanged();
  };

  const handleReset = () => {
    if (window.confirm('Reset all customizations? This will revert to original template.')) {
      setCustomColors(defaultColors);
      setTextOverrides({
        homeTagline: '', homeDescription: '', homeSubtitle: '', homePrimaryCta: '', homeImage: '',
        aboutTitle: '', aboutVision: '', aboutLeadership: '', aboutHistory: '', aboutCampusLife: '',
        coursesTitle: '', coursesEngineering: '', coursesManagement: '', coursesDataScience: '', coursesDesign: '',
        achievementsTitle: '', achievementsList: [],
        contactTitle: '', contactAddress: '', contactPhone: '', contactEmail: '',
        navigationItems: [],
        shoppingHeroTitle: '', shoppingHeroSubtitle: '', shoppingButtonStart: '', shoppingButtonJoin: '',
        shoppingCategoriesTitle: '', shoppingProductsTitle: '', shoppingSearchPlaceholder: '',
        shoppingStat1Label: '', shoppingStat2Label: '', shoppingStat3Label: '',
        statProducts: 0, statCustomers: 0, statStores: 0,
        categories: [], products: [],
      });
      applyColorVariables(defaultColors);
      setHasUnsavedChanges(true);
    }
  };

  const handleTextChangeFromPanel = (field, value) => {
    setTextOverrides(prev => ({ ...prev, [field]: value }));
    markAsChanged();
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

  // ==================== PREVIEW FULL‑SCREEN TOGGLE ====================
  const handlePreview = () => {
    setViewFullScreen(prev => !prev);
  };

  // ==================== BUILD CURRENT CUSTOMIZATION ====================
  const buildCustomizedTemplate = () => {
    if (!loadedTemplate) return null;
    const customized = {
      ...loadedTemplate,
      id: userId || loadedTemplate.id,
      templateId: selectedTemplateId,
      isCustomized: true,
      lastModified: new Date().toISOString(),
      themes: loadedTemplate.themes.map(t => ({
        ...t,
        accentColor: t.id === theme ? accentColor : t.accentColor,
        buttonBg: t.id === theme ? buttonBg : t.buttonBg,
        textColor: t.id === theme ? textColor : t.textColor,
        cardBg: t.id === theme ? cardBg : t.cardBg,
        cardBorder: t.id === theme ? cardBorder : t.cardBorder,
        headerBg: t.id === theme ? headerBg : t.headerBg,
        footerBg: t.id === theme ? footerBg : t.footerBg,
        logoColor: t.id === theme ? logoColor : t.logoColor,
        menuColor: t.id === theme ? menuColor : t.menuColor,
        menuHoverColor: t.id === theme ? menuHoverColor : t.menuHoverColor,
      })),
      home: {
        ...loadedTemplate.home,
        tagline: textOverrides.homeTagline || loadedTemplate.home?.tagline,
        description: textOverrides.homeDescription || loadedTemplate.home?.description,
        subtitle: textOverrides.homeSubtitle || loadedTemplate.home?.subtitle,
        primaryCta: textOverrides.homePrimaryCta || loadedTemplate.home?.primaryCta,
        image: textOverrides.homeImage || loadedTemplate.home?.image,
      },
      about: {
        ...loadedTemplate.about,
        title: textOverrides.aboutTitle || loadedTemplate.about?.title,
        sections: {
          'Our Vision': textOverrides.aboutVision || loadedTemplate.about?.sections?.['Our Vision'],
          'Leadership': textOverrides.aboutLeadership || loadedTemplate.about?.sections?.['Leadership'],
          'History': textOverrides.aboutHistory || loadedTemplate.about?.sections?.['History'],
          'Campus Life': textOverrides.aboutCampusLife || loadedTemplate.about?.sections?.['Campus Life'],
        }
      },
      courses: {
        ...loadedTemplate.courses,
        title: textOverrides.coursesTitle || loadedTemplate.courses?.title,
        details: {
          'Engineering': textOverrides.coursesEngineering || loadedTemplate.courses?.details?.['Engineering'],
          'Management': textOverrides.coursesManagement || loadedTemplate.courses?.details?.['Management'],
          'Data Science': textOverrides.coursesDataScience || loadedTemplate.courses?.details?.['Data Science'],
          'Design': textOverrides.coursesDesign || loadedTemplate.courses?.details?.['Design'],
        }
      },
      achievements: {
        ...loadedTemplate.achievements,
        title: textOverrides.achievementsTitle || loadedTemplate.achievements?.title,
        list: textOverrides.achievementsList.length ? textOverrides.achievementsList : loadedTemplate.achievements?.list,
      },
      contact: {
        ...loadedTemplate.contact,
        title: textOverrides.contactTitle || loadedTemplate.contact?.title,
        address: textOverrides.contactAddress || loadedTemplate.contact?.address,
        phone: textOverrides.contactPhone || loadedTemplate.contact?.phone,
        email: textOverrides.contactEmail || loadedTemplate.contact?.email,
      },
      navigation: textOverrides.navigationItems.length ? textOverrides.navigationItems : loadedTemplate.navigation,
    };
    if (isShoppingCart) {
      customized.shoppingContent = {
        ...loadedTemplate.shoppingContent,
        heroTitle: textOverrides.shoppingHeroTitle || loadedTemplate.shoppingContent?.heroTitle,
        heroSubtitle: textOverrides.shoppingHeroSubtitle || loadedTemplate.shoppingContent?.heroSubtitle,
        buttonStart: textOverrides.shoppingButtonStart || loadedTemplate.shoppingContent?.buttonStart,
        buttonJoin: textOverrides.shoppingButtonJoin || loadedTemplate.shoppingContent?.buttonJoin,
        categoriesTitle: textOverrides.shoppingCategoriesTitle || loadedTemplate.shoppingContent?.categoriesTitle,
        productsTitle: textOverrides.shoppingProductsTitle || loadedTemplate.shoppingContent?.productsTitle,
        searchPlaceholder: textOverrides.shoppingSearchPlaceholder || loadedTemplate.shoppingContent?.searchPlaceholder,
        stat1Label: textOverrides.shoppingStat1Label || loadedTemplate.shoppingContent?.stat1Label,
        stat2Label: textOverrides.shoppingStat2Label || loadedTemplate.shoppingContent?.stat2Label,
        stat3Label: textOverrides.shoppingStat3Label || loadedTemplate.shoppingContent?.stat3Label,
      };
      customized.stats = {
        products: textOverrides.statProducts !== 0 ? textOverrides.statProducts : loadedTemplate.stats?.products,
        customers: textOverrides.statCustomers !== 0 ? textOverrides.statCustomers : loadedTemplate.stats?.customers,
        stores: textOverrides.statStores !== 0 ? textOverrides.statStores : loadedTemplate.stats?.stores,
      };
      customized.categories = textOverrides.categories.length ? textOverrides.categories : loadedTemplate.categories;
      customized.products = textOverrides.products.length ? textOverrides.products : loadedTemplate.products;
    }
    return customized;
  };

  // ==================== EVENT HANDLERS ====================
  const handleGenerateJSON = () => {
    const customized = buildCustomizedTemplate();
    if (!customized) return;
    if (userId) {
      saveUserCustomizedTemplate(userId, selectedTemplateId, customized);
      setHasUnsavedChanges(false);
      alert(`✅ Saved for ${user?.name}!`);
    }
  };

  const handleResetToOriginal = async () => {
    if (window.confirm('Reset to original template? All customizations lost.')) {
      if (userId && originalTemplate) {
        resetUserTemplate(userId, selectedTemplateId, originalTemplate);
        try {
          const dirHandle = await getFolderHandle();
          const fileName = `template_${selectedTemplateId}_user_${userId}.json`;
          const fileHandle = await dirHandle.getFileHandle(fileName);
          await fileHandle.remove();
        } catch (err) { /* ignore */ }
        const resetTemplate = loadUserCustomizedTemplate(userId, selectedTemplateId, originalTemplate);
        setLoadedTemplate(resetTemplate);
        setTextOverrides({
          homeTagline: '', homeDescription: '', homeSubtitle: '', homePrimaryCta: '', homeImage: '',
          aboutTitle: '', aboutVision: '', aboutLeadership: '', aboutHistory: '', aboutCampusLife: '',
          coursesTitle: '', coursesEngineering: '', coursesManagement: '', coursesDataScience: '', coursesDesign: '',
          achievementsTitle: '', achievementsList: [],
          contactTitle: '', contactAddress: '', contactPhone: '', contactEmail: '',
          navigationItems: [],
          shoppingHeroTitle: '', shoppingHeroSubtitle: '', shoppingButtonStart: '', shoppingButtonJoin: '',
          shoppingCategoriesTitle: '', shoppingProductsTitle: '', shoppingSearchPlaceholder: '',
          shoppingStat1Label: '', shoppingStat2Label: '', shoppingStat3Label: '',
          statProducts: 0, statCustomers: 0, statStores: 0,
          categories: [], products: [],
        });
        setHasUnsavedChanges(false);
        alert('✅ Reset to original. Saved file removed from folder.');
      }
    }
  };

  // ==================== PREPARE DATA FOR PREVIEW ====================
  const shoppingContentData = loadedTemplate ? {
    ...loadedTemplate.shoppingContent,
    heroTitle: textOverrides.shoppingHeroTitle || loadedTemplate.shoppingContent?.heroTitle || "Organic Foods at your Doorsteps",
    heroSubtitle: textOverrides.shoppingHeroSubtitle || loadedTemplate.shoppingContent?.heroSubtitle || "Fresh, healthy, and delicious groceries delivered to your home",
    buttonStart: textOverrides.shoppingButtonStart || loadedTemplate.shoppingContent?.buttonStart || "START SHOPPING",
    buttonJoin: textOverrides.shoppingButtonJoin || loadedTemplate.shoppingContent?.buttonJoin || "JOIN NOW",
    categoriesTitle: textOverrides.shoppingCategoriesTitle || loadedTemplate.shoppingContent?.categoriesTitle || "Shop by Category",
    productsTitle: textOverrides.shoppingProductsTitle || loadedTemplate.shoppingContent?.productsTitle || "Featured Products",
    searchPlaceholder: textOverrides.shoppingSearchPlaceholder || loadedTemplate.shoppingContent?.searchPlaceholder || "Search products...",
    stat1Label: textOverrides.shoppingStat1Label || loadedTemplate.shoppingContent?.stat1Label || "PRODUCTS",
    stat2Label: textOverrides.shoppingStat2Label || loadedTemplate.shoppingContent?.stat2Label || "HAPPY CUSTOMERS",
    stat3Label: textOverrides.shoppingStat3Label || loadedTemplate.shoppingContent?.stat3Label || "STORES",
  } : {};

  const statsData = loadedTemplate ? {
    products: textOverrides.statProducts !== 0 ? textOverrides.statProducts : (loadedTemplate.stats?.products || 9000),
    customers: textOverrides.statCustomers !== 0 ? textOverrides.statCustomers : (loadedTemplate.stats?.customers || 50000),
    stores: textOverrides.statStores !== 0 ? textOverrides.statStores : (loadedTemplate.stats?.stores || 25),
  } : {};

  const categoriesData = textOverrides.categories?.length ? textOverrides.categories : loadedTemplate?.categories || [];
  const productsData = textOverrides.products?.length ? textOverrides.products : loadedTemplate?.products || [];

  const mergedShoppingTemplate = loadedTemplate ? {
    ...loadedTemplate,
    shoppingContent: shoppingContentData,
    stats: statsData,
    categories: categoriesData,
    products: productsData,
  } : null;

  const homeData = loadedTemplate ? {
    ...loadedTemplate.home,
    tagline: textOverrides.homeTagline || loadedTemplate.home?.tagline,
    description: textOverrides.homeDescription || loadedTemplate.home?.description,
    subtitle: textOverrides.homeSubtitle || loadedTemplate.home?.subtitle,
    primaryCta: textOverrides.homePrimaryCta || loadedTemplate.home?.primaryCta || loadedTemplate.home?.cta,
    image: textOverrides.homeImage !== undefined && textOverrides.homeImage !== null
      ? (textOverrides.homeImage.trim() === "" ? "" : textOverrides.homeImage)
      : loadedTemplate.home?.image,
  } : null;

  const aboutData = loadedTemplate ? {
    ...loadedTemplate.about,
    title: textOverrides.aboutTitle || loadedTemplate.about?.title,
    sections: {
      'Our Vision': textOverrides.aboutVision || loadedTemplate.about?.sections?.['Our Vision'],
      'Leadership': textOverrides.aboutLeadership || loadedTemplate.about?.sections?.['Leadership'],
      'History': textOverrides.aboutHistory || loadedTemplate.about?.sections?.['History'],
      'Campus Life': textOverrides.aboutCampusLife || loadedTemplate.about?.sections?.['Campus Life'],
    }
  } : null;

  const coursesData = loadedTemplate ? {
    ...loadedTemplate.courses,
    title: textOverrides.coursesTitle || loadedTemplate.courses?.title,
    details: {
      'Engineering': textOverrides.coursesEngineering || loadedTemplate.courses?.details?.['Engineering'],
      'Management': textOverrides.coursesManagement || loadedTemplate.courses?.details?.['Management'],
      'Data Science': textOverrides.coursesDataScience || loadedTemplate.courses?.details?.['Data Science'],
      'Design': textOverrides.coursesDesign || loadedTemplate.courses?.details?.['Design'],
    }
  } : null;

  const achievementsData = loadedTemplate ? {
    ...loadedTemplate.achievements,
    title: textOverrides.achievementsTitle || loadedTemplate.achievements?.title,
    list: textOverrides.achievementsList.length ? textOverrides.achievementsList : loadedTemplate.achievements?.list,
  } : null;

  const contactData = loadedTemplate ? {
    ...loadedTemplate.contact,
    title: textOverrides.contactTitle || loadedTemplate.contact?.title,
    address: textOverrides.contactAddress || loadedTemplate.contact?.address,
    phone: textOverrides.contactPhone || loadedTemplate.contact?.phone,
    email: textOverrides.contactEmail || loadedTemplate.contact?.email,
  } : null;

  const navigationData = textOverrides.navigationItems.length ? textOverrides.navigationItems : loadedTemplate?.navigation || [];

  // ==================== RENDER CONTENT ====================
  const renderContent = () => {
    if (!loadedTemplate) return null;
    if (isShoppingCart) {
      switch(activeTab) {
        case 'Home': return <Home data={mergedShoppingTemplate} isShoppingCart={true} accentColor={accentColor} addToCart={addToCart} searchQuery={search} setSearch={setSearch} navigate={navigate} />;
        case 'Cart': return <ShoppingCart cart={cart} removeFromCart={removeFromCart} updateQty={updateQty} cartTotal={cartTotal} setActiveTab={setActiveTab} accentColor={accentColor} />;
        case 'Checkout': return <ShoppingCheckout cart={cart} cartTotal={cartTotal} clearCart={clearCart} setActiveTab={setActiveTab} accentColor={accentColor} />;
        default: return <Home data={mergedShoppingTemplate} isShoppingCart={true} accentColor={accentColor} addToCart={addToCart} searchQuery={search} setSearch={setSearch} navigate={navigate} />;
      }
    }
    if (isOverlayDesign) {
      switch(activeTab) {
        case 'Home': return <Home data={homeData} styles={loadedTemplate.styles?.home} isOverlayDesign={true} accentColor={accentColor} primaryColor={primaryColor} descriptionColor={descriptionColor} buttonBg={buttonBg} navigate={navigate} />;
        case 'About Us': return <About data={aboutData} styles={loadedTemplate.styles?.about} isOverlayDesign={true} accentColor={accentColor} primaryColor={primaryColor} textColor="#ffffff" cardBg="rgba(255,255,255,0.1)" cardBorder="rgba(255,255,255,0.2)" />;
        case 'Courses': return <Courses data={coursesData} styles={loadedTemplate.styles?.courses} isOverlayDesign={true} accentColor={accentColor} primaryColor={primaryColor} textColor="#ffffff" cardBg="rgba(255,255,255,0.1)" cardBorder="rgba(255,255,255,0.2)" />;
        case 'Achievements': return <Achievements data={achievementsData} styles={loadedTemplate.styles?.achievements} isOverlayDesign={true} accentColor={accentColor} primaryColor={primaryColor} textColor="#ffffff" cardBg="rgba(255,255,255,0.1)" cardBorder="rgba(255,255,255,0.2)" />;
        case 'Contact': return <Contact data={contactData} styles={loadedTemplate.styles?.contact} isOverlayDesign={true} accentColor={accentColor} primaryColor={primaryColor} textColor="#ffffff" cardBg="rgba(255,255,255,0.1)" cardBorder="rgba(255,255,255,0.2)" />;
        default: return <Home data={homeData} styles={loadedTemplate.styles?.home} isOverlayDesign={true} accentColor={accentColor} primaryColor={primaryColor} descriptionColor={descriptionColor} buttonBg={buttonBg} navigate={navigate} />;
      }
    }
    // Educational template
    switch(activeTab) {
      case 'Home': return <Home data={homeData} styles={loadedTemplate.styles?.home} isOverlayDesign={false} primaryColor={primaryColor} descriptionColor={descriptionColor} buttonBg={buttonBg} navigate={navigate} />;
      case 'About Us': return <About data={aboutData} styles={loadedTemplate.styles?.about} isOverlayDesign={false} primaryColor={primaryColor} textColor={textColor} cardBg={cardBg} cardBorder={cardBorder} />;
      case 'Courses': return <Courses data={coursesData} styles={loadedTemplate.styles?.courses} isOverlayDesign={false} primaryColor={primaryColor} textColor={textColor} cardBg={cardBg} cardBorder={cardBorder} />;
      case 'Achievements': return <Achievements data={achievementsData} styles={loadedTemplate.styles?.achievements} isOverlayDesign={false} primaryColor={primaryColor} textColor={textColor} cardBg={cardBg} cardBorder={cardBorder} />;
      case 'Contact': return <Contact data={contactData} styles={loadedTemplate.styles?.contact} isOverlayDesign={false} primaryColor={primaryColor} textColor={textColor} cardBg={cardBg} cardBorder={cardBorder} />;
      default: return <Home data={homeData} styles={loadedTemplate.styles?.home} isOverlayDesign={false} primaryColor={primaryColor} descriptionColor={descriptionColor} buttonBg={buttonBg} navigate={navigate} />;
    }
  };

  // ==================== LOADING STATE ====================
  if (!loadedTemplate) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white"><div className="text-center p-8"><h1 className="text-2xl mb-4">Loading template...</h1><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div></div></div>;
  }

  // ==================== MAIN RENDER ====================
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      {/* Customization Panel – hidden in full‑screen mode */}
      {!viewFullScreen && (
        <CustomizationPanel
          isOverlayDesign={isOverlayDesign}
          customColors={{ accentColor, overlayBg, buttonBg, cardBg, cardBorder, textColor, descriptionColor, logoColor, menuColor, menuHoverColor, primaryColor, headerBg, footerBg }}
          onColorChange={handleColorChange}
          onReset={handleReset}
          templateData={loadedTemplate}
          onTextChange={handleTextChangeFromPanel}
          onExportJSON={handleGenerateJSON}
          user={user}
          onResetToOriginal={handleResetToOriginal}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
          lastSaved={lastSaved}
          onHandlePreview={handlePreview}
        />
      )}

      {/* Preview area – takes full width when panel hidden */}
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
          width: viewFullScreen ? '100%' : 'auto'
        }}
      >
        {/* Exit full‑screen button (only shown in full‑screen mode) */}
        {viewFullScreen && (
          <button
            type="button"  // <-- Added type="button" to prevent any accidental form submit
            onClick={() => setViewFullScreen(false)}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 200,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              backdropFilter: 'blur(4px)',
              fontFamily: 'sans-serif'
            }}
          >
            ✕ Exit Full Screen
          </button>
        )}

        {isShoppingCart && (
          <>
            <div style={{ position: 'fixed', inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1 }} />
          </>
        )}
        {isOverlayDesign && (
          <>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${homeData?.image || loadedTemplate.home?.image})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundColor: overlayBg, zIndex: 1, pointerEvents: 'none' }} />
          </>
        )}
        <div style={{ flexShrink: 0, width: '100%', position: 'relative', zIndex: 100 }}>
          <Navbar
            navData={navigationData}
            themesData={loadedTemplate.themes || []}
            activeTab={activeTab}
            templateData={loadedTemplate}
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
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', zIndex: 2 }}>
          <div className={`min-h-full flex flex-col ${!isOverlayDesign && !isShoppingCart ? 'bg-white' : ''}`}>
            <main className={`flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 ${isOverlayDesign ? 'relative z-20 max-w-7xl pt-8' : isShoppingCart ? 'relative z-20 max-w-6xl pt-28 md:pt-32' : 'max-w-6xl pt-8'}`}>
              <div key={activeTab} className="w-full">{renderContent()}</div>
            </main>
            <footer className="w-full py-6 mt-auto transition-all duration-300" style={{ backgroundColor: isOverlayDesign ? 'rgba(0,0,0,0.8)' : isShoppingCart ? 'transparent' : footerBg, borderTop: (isOverlayDesign || isShoppingCart) ? '1px solid rgba(255,255,255,0.1)' : 'none', position: 'relative', zIndex: 2 }}>
              <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs tracking-wide ${(isOverlayDesign || isShoppingCart) ? 'text-white/40' : 'text-white/70'}`}>
                © {new Date().getFullYear()} {loadedTemplate.title}. All rights reserved.
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}