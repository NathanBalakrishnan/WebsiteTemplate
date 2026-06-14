import { useState, useEffect } from "react";
import ColorPickerRow from "./ColorPickerRow";
import "../../assets/css/CustomizationPanel.css";
import DynamicIcon from "../../components/common/DynamicIcon";

const CustomizationPanel = ({
  isOverlayDesign,
  customColors,
  onColorChange,
  onReset,
  templateData,
  onTextChange,
  onExportJSON,
  user,
  onExportAll,
  onResetToOriginal,
  isSaving,
  hasUnsavedChanges,
  lastSaved,
  onLoadFromFolder,   // <-- new prop
  onHandlePreview
}) => {
  const [activeMainTab, setActiveMainTab] = useState("colors");
  const [activeColorSubTab, setActiveColorSubTab] = useState("theme");
  const [activeTemplate1SubTab, setActiveTemplate1SubTab] = useState("brand");
  const [viewPreview,setviewPreview]= useState(false);
  const isShoppingCart = templateData?.themeScope === "shopping-cart";

  // Local state for text opacity
  const [textOpacity, setTextOpacity] = useState(() => {
    const textColor = customColors.textColor || "#1f2937";
    if (textColor.startsWith("rgba")) {
      return getOpacityFromColor(textColor);
    }
    return 1;
  });

  // Local state for card background opacity
  const [cardBgOpacity, setCardBgOpacity] = useState(() => {
    const cardBg = customColors.cardBg || "rgba(255,255,255,0.1)";
    if (cardBg.startsWith("rgba")) {
      return getOpacityFromColor(cardBg);
    }
    return 0.1;
  });
  // Local state for text content - For all templates
  const [textContent, setTextContent] = useState({
    // Template 1 & 2 content
    homeTagline: "",
    homeDescription: "",
    homeSubtitle: "",
    homePrimaryCta: "",
    homeImage: "",
    aboutTitle: "",
    aboutVision: "",
    aboutLeadership: "",
    aboutHistory: "",
    aboutCampusLife: "",
    coursesTitle: "",
    coursesEngineering: "",
    coursesManagement: "",
    coursesDataScience: "",
    coursesDesign: "",
    achievementsTitle: "",
    achievementsList: [],
    contactTitle: "",
    contactAddress: "",
    contactPhone: "",
    contactEmail: "",
    navigationItems: [],
    // Template 3 shopping cart content
    shoppingHeroTitle: "",
    shoppingHeroSubtitle: "",
    shoppingButtonStart: "",
    shoppingButtonJoin: "",
    shoppingStat1Label: "",
    shoppingStat2Label: "",
    shoppingStat3Label: "",
    shoppingCategoriesTitle: "",
    shoppingProductsTitle: "",
    shoppingSearchPlaceholder: "",
    statProducts: 0,
    statCustomers: 0,
    statStores: 0,
    categories: [],
    products: [],
  });

  // Load data based on template type
  useEffect(() => {
    if (templateData) {
      if (isShoppingCart) {
        setTextContent((prev) => ({
          ...prev,
          shoppingHeroTitle:
            templateData.shoppingContent?.heroTitle ||
            "Organic Foods at your Doorsteps",
          shoppingHeroSubtitle:
            templateData.shoppingContent?.heroSubtitle ||
            "Fresh, healthy, and delicious groceries delivered to your home",
          shoppingButtonStart:
            templateData.shoppingContent?.buttonStart || "START SHOPPING",
          shoppingButtonJoin:
            templateData.shoppingContent?.buttonJoin || "JOIN NOW",
          shoppingStat1Label:
            templateData.shoppingContent?.stat1Label || "PRODUCTS",
          shoppingStat2Label:
            templateData.shoppingContent?.stat2Label || "HAPPY CUSTOMERS",
          shoppingStat3Label:
            templateData.shoppingContent?.stat3Label || "STORES",
          shoppingCategoriesTitle:
            templateData.shoppingContent?.categoriesTitle || "Shop by Category",
          shoppingProductsTitle:
            templateData.shoppingContent?.productsTitle || "Featured Products",
          shoppingSearchPlaceholder:
            templateData.shoppingContent?.searchPlaceholder ||
            "Search products...",
          statProducts: templateData.stats?.products || 9000,
          statCustomers: templateData.stats?.customers || 50000,
          statStores: templateData.stats?.stores || 25,
          categories: templateData.categories || [],
          products: templateData.products || [],
        }));
      } else {
        setTextContent((prev) => ({
          ...prev,
          homeTagline: templateData.home?.tagline || "",
          homeDescription: templateData.home?.description || "",
          homeSubtitle: templateData.home?.subtitle || "",
          homePrimaryCta:
            templateData.home?.primaryCta || templateData.home?.cta || "",
          homeImage: templateData.home?.image || "",
          aboutTitle: templateData.about?.title || "",
          aboutVision: templateData.about?.sections?.["Our Vision"] || "",
          aboutLeadership: templateData.about?.sections?.["Leadership"] || "",
          aboutHistory: templateData.about?.sections?.["History"] || "",
          aboutCampusLife: templateData.about?.sections?.["Campus Life"] || "",
          coursesTitle: templateData.courses?.title || "",
          coursesEngineering:
            templateData.courses?.details?.["Engineering"] || "",
          coursesManagement:
            templateData.courses?.details?.["Management"] || "",
          coursesDataScience:
            templateData.courses?.details?.["Data Science"] || "",
          coursesDesign: templateData.courses?.details?.["Design"] || "",
          achievementsTitle: templateData.achievements?.title || "",
          achievementsList: templateData.achievements?.list || [],
          contactTitle: templateData.contact?.title || "",
          contactAddress: templateData.contact?.address || "",
          contactPhone: templateData.contact?.phone || "",
          contactEmail: templateData.contact?.email || "",
          navigationItems: templateData.navigation || [],
        }));
      }
    }
  }, [templateData, isShoppingCart]);

  useEffect(() => {
    const opacity = getOpacityFromColor(customColors.textColor || "#1f2937");
    setTextOpacity(opacity);
  }, [customColors.textColor]);

  useEffect(() => {
    const opacity = getOpacityFromColor(
      customColors.cardBg || "rgba(255,255,255,0.1)",
    );
    setCardBgOpacity(opacity);
  }, [customColors.cardBg]);

  const handleTextChange = (field, value) => {
    setTextContent((prev) => ({ ...prev, [field]: value }));
    if (onTextChange) {
      onTextChange(field, value);
    }
  };

  const handleAchievementChange = (index, value) => {
    const updatedList = [...textContent.achievementsList];
    updatedList[index] = value;
    setTextContent((prev) => ({ ...prev, achievementsList: updatedList }));
    if (onTextChange) {
      onTextChange("achievementsList", updatedList);
    }
  };

  // Navigation handlers
  const handleNavigationNameChange = (index, value) => {
    const updatedNav = [...textContent.navigationItems];
    updatedNav[index] = { ...updatedNav[index], name: value };
    setTextContent((prev) => ({ ...prev, navigationItems: updatedNav }));
    if (onTextChange) {
      onTextChange("navigationItems", updatedNav);
    }
  };

  const handleNavigationChange = (index, value) => {
    const updatedNav = [...textContent.navigationItems];
    updatedNav[index] = { ...updatedNav[index], label: value };
    setTextContent((prev) => ({ ...prev, navigationItems: updatedNav }));
    if (onTextChange) {
      onTextChange("navigationItems", updatedNav);
    }
  };

  const handleNavigationTypeChange = (index, value) => {
    const updatedNav = [...textContent.navigationItems];
    updatedNav[index] = {
      ...updatedNav[index],
      type: value,
      menuItems:
        value === "dropdown"
          ? updatedNav[index].menuItems || ["New Item"]
          : undefined,
    };
    setTextContent((prev) => ({ ...prev, navigationItems: updatedNav }));
    if (onTextChange) {
      onTextChange("navigationItems", updatedNav);
    }
  };

  const handleAddNavItem = () => {
    const newItem = {
      name: "New Menu",
      label: "New Menu",
      type: "link",
      menuItems: [],
    };
    const updatedNav = [...textContent.navigationItems, newItem];
    setTextContent((prev) => ({ ...prev, navigationItems: updatedNav }));
    if (onTextChange) {
      onTextChange("navigationItems", updatedNav);
    }
  };

  const handleRemoveNavItem = (index) => {
    const updatedNav = textContent.navigationItems.filter(
      (_, i) => i !== index,
    );
    setTextContent((prev) => ({ ...prev, navigationItems: updatedNav }));
    if (onTextChange) {
      onTextChange("navigationItems", updatedNav);
    }
  };

  const handleAddDropdownItem = (navIndex) => {
    const updatedNav = [...textContent.navigationItems];
    if (!updatedNav[navIndex].menuItems) {
      updatedNav[navIndex].menuItems = [];
    }
    updatedNav[navIndex].menuItems.push(
      `New Item ${updatedNav[navIndex].menuItems.length + 1}`,
    );
    setTextContent((prev) => ({ ...prev, navigationItems: updatedNav }));
    if (onTextChange) {
      onTextChange("navigationItems", updatedNav);
    }
  };

  const handleRemoveDropdownItem = (navIndex, menuItemIndex) => {
    const updatedNav = [...textContent.navigationItems];
    updatedNav[navIndex].menuItems = updatedNav[navIndex].menuItems.filter(
      (_, i) => i !== menuItemIndex,
    );
    setTextContent((prev) => ({ ...prev, navigationItems: updatedNav }));
    if (onTextChange) {
      onTextChange("navigationItems", updatedNav);
    }
  };

  const handleDropdownItemsChange = (navIndex, menuItemIndex, value) => {
    const updatedNav = [...textContent.navigationItems];
    updatedNav[navIndex].menuItems[menuItemIndex] = value;
    setTextContent((prev) => ({ ...prev, navigationItems: updatedNav }));
    if (onTextChange) {
      onTextChange("navigationItems", updatedNav);
    }
  };

  const handleStatChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setTextContent((prev) => ({ ...prev, [field]: numValue }));
    if (onTextChange) {
      onTextChange(field, numValue);
    }
  };

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...textContent.categories];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    setTextContent((prev) => ({ ...prev, categories: updatedCategories }));
    if (onTextChange) {
      onTextChange("categories", updatedCategories);
    }
  };

  const handleAddCategory = () => {
    const newCategory = {
      id: Date.now(),
      name: "New Category",
      icon: "🛒",
      slug: "new-category",
    };
    const updatedCategories = [...textContent.categories, newCategory];
    setTextContent((prev) => ({ ...prev, categories: updatedCategories }));
    if (onTextChange) {
      onTextChange("categories", updatedCategories);
    }
  };

  const handleRemoveCategory = (index) => {
    const updatedCategories = textContent.categories.filter(
      (_, i) => i !== index,
    );
    setTextContent((prev) => ({ ...prev, categories: updatedCategories }));
    if (onTextChange) {
      onTextChange("categories", updatedCategories);
    }
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...textContent.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setTextContent((prev) => ({ ...prev, products: updatedProducts }));
    if (onTextChange) {
      onTextChange("products", updatedProducts);
    }
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: "New Product",
      category: textContent.categories[0]?.name || "Fruits",
      price: 0,
      oldPrice: 0,
      unit: "each",
      image: "https://via.placeholder.com/300",
      organic: false,
      rating: 5,
    };
    const updatedProducts = [...textContent.products, newProduct];
    setTextContent((prev) => ({ ...prev, products: updatedProducts }));
    if (onTextChange) {
      onTextChange("products", updatedProducts);
    }
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = textContent.products.filter((_, i) => i !== index);
    setTextContent((prev) => ({ ...prev, products: updatedProducts }));
    if (onTextChange) {
      onTextChange("products", updatedProducts);
    }
  };

  // Helper functions
  const getRGBFromColor = (color) => {
    if (!color) return { r: 0, g: 0, b: 0 };
    if (color.startsWith("rgba")) {
      const match = color.match(/\d+/g);
      if (match) {
        return {
          r: parseInt(match[0]),
          g: parseInt(match[1]),
          b: parseInt(match[2]),
        };
      }
    } else if (color.startsWith("#")) {
      const hex = color.substring(1);
      if (hex.length === 6) {
        return {
          r: parseInt(hex.substring(0, 2), 16),
          g: parseInt(hex.substring(2, 4), 16),
          b: parseInt(hex.substring(4, 6), 16),
        };
      } else if (hex.length === 3) {
        return {
          r: parseInt(hex.charAt(0) + hex.charAt(0), 16),
          g: parseInt(hex.charAt(1) + hex.charAt(1), 16),
          b: parseInt(hex.charAt(2) + hex.charAt(2), 16),
        };
      }
    } else if (color.startsWith("rgb")) {
      const match = color.match(/\d+/g);
      if (match) {
        return {
          r: parseInt(match[0]),
          g: parseInt(match[1]),
          b: parseInt(match[2]),
        };
      }
    }
    return { r: 0, g: 0, b: 0 };
  };

  const getOpacityFromColor = (color) => {
    if (!color) return 0.5;
    if (color.startsWith("rgba")) {
      const match = color.match(/[\d.]+(?=\))/);
      if (match && match[0]) {
        return parseFloat(match[0]);
      }
      const parts = color.match(/[\d.]+/g);
      if (parts && parts.length === 4) {
        return parseFloat(parts[3]);
      }
    }
    return 1;
  };

  const rgbaToHex = (color) => {
    const { r, g, b } = getRGBFromColor(color);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  const [opacityValue, setOpacityValue] = useState(() => {
    return getOpacityFromColor(customColors.overlayBg);
  });

  useEffect(() => {
    const newOpacity = getOpacityFromColor(customColors.overlayBg);
    setOpacityValue(newOpacity);
  }, [customColors.overlayBg]);

  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setOpacityValue(newOpacity);
    const { r, g, b } = getRGBFromColor(customColors.overlayBg);
    onColorChange("overlayBg", `rgba(${r},${g},${b},${newOpacity})`);
  };

  const handleTextOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setTextOpacity(newOpacity);
    const { r, g, b } = getRGBFromColor(customColors.textColor);
    onColorChange("textColor", `rgba(${r},${g},${b},${newOpacity})`);
  };

  const handleTextColorChange = (hex) => {
    const opacity = textOpacity;
    const { r, g, b } = getRGBFromColor(hex);
    onColorChange("textColor", `rgba(${r},${g},${b},${opacity})`);
  };

  const handleCardBgColorChange = (hex) => {
    const opacity = cardBgOpacity;
    const { r, g, b } = getRGBFromColor(hex);
    onColorChange("cardBg", `rgba(${r},${g},${b},${opacity})`);
  };

  const handleCardBgOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setCardBgOpacity(newOpacity);
    const { r, g, b } = getRGBFromColor(customColors.cardBg);
    onColorChange("cardBg", `rgba(${r},${g},${b},${newOpacity})`);
  };

  const handleOverlayColorChange = (hex) => {
    const opacity = getOpacityFromColor(customColors.overlayBg);
    const { r, g, b } = getRGBFromColor(hex);
    onColorChange("overlayBg", `rgba(${r},${g},${b},${opacity})`);
  };

  return (
    <div className="customization-panel">
      <div className="panel-header">
        <h1
          className="panel-title"
          style={{ display: "flex", alignItems: "center", gap: "10px", fontSize:"40px" }}
        >
          <span>Customize Your Template</span>
        </h1>

        {/* Save Status Indicators */}
        <div className="save-status-container">
          {isSaving && (
            <div className="saving-indicator">
              <span className="saving-spinner"></span>
              Saving...
            </div>
          )}
          {hasUnsavedChanges && !isSaving && (
            <div className="unsaved-indicator">⚡ Unsaved changes</div>
          )}
          {lastSaved && !hasUnsavedChanges && !isSaving && (
            <div className="saved-indicator">
              ✓ Saved at {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="button-group">
           {/* <div className="button-group">
          <button onClick={onReset} className="reset-button">Reset Current Tab</button>
          {onResetToOriginal && <button onClick={onResetToOriginal} className="reset-original-button">Reset to Original Template</button>}
          <button onClick={onExportJSON} className="export-button">Save</button>
        </div> */}
          <button onClick={onReset} className="reset-button">
            <DynamicIcon
              name="FaArrowsRotate"
              size={17}
              style={{ color: "white", marginRight: "5px" }}
            />
            Reset Current Tab
          </button>
          {onResetToOriginal && (
            <button onClick={onResetToOriginal} className="reset-original-button">
              <DynamicIcon
                name="FaArrowsRotate"
                size={17}
                style={{ color: "white", marginRight: "5px" }}
              />
              Reset to Original Template
            </button>
          )}
          <button onClick={onExportJSON} className="export-button">
            <DynamicIcon
              name="IoIosSave"
              size={19}
              style={{ color: "white", marginRight: "5px" }}
            />
            Save
          </button>
          <button onClick={onHandlePreview} className="export-button">
            <DynamicIcon
              name="IoIosSave"
              size={19}
              style={{ color: "white", marginRight: "5px" }}
            />
            Preview Your Customization
          </button>
          {user && onExportAll && (
            <button onClick={onExportAll} className="export-all-button">
              <DynamicIcon
                name="IoIosSave"
                size={19}
                style={{ color: "white", marginRight: "5px" }}
              />
              Save All
            </button>
          )}
          {user && onLoadFromFolder && (
            <button onClick={onLoadFromFolder} className="load-folder-button">
              <DynamicIcon
                name="FaFolderOpen"
                size={19}
                style={{ color: "white", marginRight: "5px" }}
              />
              Load from Folder
            </button>
          )}
        </div>

        <div className="main-tabs">
          <button
            onClick={() => setActiveMainTab("colors")}
            className={`main-tab ${activeMainTab === "colors" ? "main-tab-active" : "main-tab-inactive"}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <DynamicIcon
              name="IoIosColorPalette"
              size={20}
              style={{ color: "currentColor" }}
            />
            Colors
          </button>
          <button
            onClick={() => setActiveMainTab("text")}
            className={`main-tab ${activeMainTab === "text" ? "main-tab-active" : "main-tab-inactive"}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          >
            <DynamicIcon
              name="FiEye"
              size={19}
              style={{ color: "currentColor" }}
            />
            Text Content
          </button>
        </div>
      </div>

      {/* COLORS TAB */}
      {activeMainTab === "colors" && (
        <div className="mt-20">
          {/* For Shopping Cart Template */}
          {isShoppingCart && (
            <div className="section">
              <h3 className="section-title">🎨 Theme Colors</h3>

              <ColorPickerRow
                label="Accent Color"
                color={customColors.accentColor || "#14b8a6"}
                onChange={(e) => onColorChange("accentColor", e.target.value)}
                description="Primary brand color for buttons, icons, and highlights"
              />

              <div className="color-picker-row">
                <label className="color-picker-label">
                  Button Background
                  <span
                    className="color-swatch"
                    style={{
                      backgroundColor: customColors.buttonBg || "#14b8a6",
                    }}
                  />
                </label>
                <div className="color-picker-container">
                  <input
                    type="color"
                    value={rgbaToHex(customColors.buttonBg || "#14b8a6")}
                    onChange={(e) => onColorChange("buttonBg", e.target.value)}
                    className="color-picker"
                  />
                  <span className="color-value">
                    {customColors.buttonBg || "#14b8a6"}
                  </span>
                </div>
                <div className="color-description">
                  Background color for all buttons
                </div>
              </div>

              <div className="color-picker-row">
                <label className="color-picker-label">
                  Text Color
                  <span
                    className="color-swatch"
                    style={{
                      backgroundColor: rgbaToHex(
                        customColors.textColor || "#1f2937",
                      ),
                    }}
                  />
                </label>
                <div className="color-picker-container">
                  <input
                    type="color"
                    value={rgbaToHex(customColors.textColor || "#1f2937")}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="color-picker"
                  />
                  <span className="color-value">
                    {customColors.textColor || "#1f2937"}
                  </span>
                </div>
                <label className="opacity-label">
                  Text Opacity: {Math.round(textOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={textOpacity}
                  onChange={handleTextOpacityChange}
                  className="opacity-slider"
                />
                <div className="color-description">
                  Main text color across the website
                </div>
              </div>

              <div className="color-picker-row">
                <label className="color-picker-label">
                  Card Background
                  <span
                    className="color-swatch"
                    style={{
                      backgroundColor: rgbaToHex(
                        customColors.cardBg || "rgba(255,255,255,0.1)",
                      ),
                    }}
                  />
                </label>
                <div className="color-picker-container">
                  <input
                    type="color"
                    value={rgbaToHex(
                      customColors.cardBg || "rgba(255,255,255,0.1)",
                    )}
                    onChange={(e) => handleCardBgColorChange(e.target.value)}
                    className="color-picker"
                  />
                  <span className="color-value">
                    {customColors.cardBg || "rgba(255,255,255,0.1)"}
                  </span>
                </div>
                <label className="opacity-label">
                  Card Opacity: {Math.round(cardBgOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={cardBgOpacity}
                  onChange={handleCardBgOpacityChange}
                  className="opacity-slider"
                />
                <div className="color-description">
                  Background color and opacity for product cards
                </div>
              </div>

              <ColorPickerRow
                label="Card Border"
                color={customColors.cardBorder || "rgba(255,255,255,0.2)"}
                onChange={(e) => onColorChange("cardBorder", e.target.value)}
                description="Border color for product cards"
              />
            </div>
          )}

          {/* For Overlay Design Template (Template 2) */}
          {isOverlayDesign && !isShoppingCart && (
            <div className="section">
              <h3 className="section-title">
                <DynamicIcon
                  name="IoIosColorPalette"
                  size={25}
                  style={{ color: "#252424" }}
                /> Theme Colors
              </h3>
              <ColorPickerRow
                label="Accent Color"
                color={customColors.accentColor}
                onChange={(e) => onColorChange("accentColor", e.target.value)}
              />
              <div className="color-picker-row">
                <label className="color-picker-label">
                  Overlay Color
                  <span
                    className="color-swatch"
                    style={{
                      backgroundColor: rgbaToHex(customColors.overlayBg),
                    }}
                  />
                </label>
                <div className="color-picker-container">
                  <input
                    type="color"
                    value={rgbaToHex(customColors.overlayBg)}
                    onChange={(e) => handleOverlayColorChange(e.target.value)}
                    className="color-picker"
                  />
                  <span className="color-value">{customColors.overlayBg}</span>
                </div>
                <label className="opacity-label">
                  Overlay Opacity: {Math.round(opacityValue * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={opacityValue}
                  onChange={handleOpacityChange}
                  className="opacity-slider"
                />
              </div>
              <ColorPickerRow
                label="Button Background"
                color={customColors.buttonBg}
                onChange={(e) => onColorChange("buttonBg", e.target.value)}
              />
            </div>
          )}

          {/* For Educational Template (Template 1) */}
          {!isOverlayDesign && !isShoppingCart && (
            <div className="section">
              <h3 className="section-title">
                <DynamicIcon
                  name="IoIosColorPalette"
                  size={25}
                  style={{ color: "#252424" }}
                /> Brand Colors
              </h3>
              <ColorPickerRow
                label="Button Background"
  color={customColors.buttonBg}
  onChange={(e) => onColorChange("buttonBg", e.target.value)}
              />
              <ColorPickerRow
                label="Button Background"
                color={customColors.buttonBg}
                onChange={(e) => onColorChange("buttonBg", e.target.value)}
              />
              <ColorPickerRow
                label="Description Color"
                color={customColors.descriptionColor}
                onChange={(e) =>
                  onColorChange("descriptionColor", e.target.value)
                }
              />
            </div>
          )}
        </div>
      )}

      {/* TEXT CONTENT TAB */}
      {activeMainTab === "text" && (
        <div className="content-container">
          {/* For Shopping Cart Template */}
          {isShoppingCart && (
            <>
              <div className="section">
                <h3 className="section-title">🛒 Hero & Button Text</h3>
                <div className="form-group">
                  <label className="form-label">Hero Title</label>
                  <input
                    type="text"
                    value={textContent.shoppingHeroTitle}
                    onChange={(e) =>
                      handleTextChange("shoppingHeroTitle", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Hero Subtitle</label>
                  <input
                    type="text"
                    value={textContent.shoppingHeroSubtitle}
                    onChange={(e) =>
                      handleTextChange("shoppingHeroSubtitle", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Start Shopping Button</label>
                  <input
                    type="text"
                    value={textContent.shoppingButtonStart}
                    onChange={(e) =>
                      handleTextChange("shoppingButtonStart", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Join Now Button</label>
                  <input
                    type="text"
                    value={textContent.shoppingButtonJoin}
                    onChange={(e) =>
                      handleTextChange("shoppingButtonJoin", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="section">
                <h3 className="section-title">📊 Statistics</h3>
                <div className="form-group">
                  <label className="form-label">Products Stat Label</label>
                  <input
                    type="text"
                    value={textContent.shoppingStat1Label}
                    onChange={(e) =>
                      handleTextChange("shoppingStat1Label", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Products Stat Value</label>
                  <input
                    type="number"
                    value={textContent.statProducts}
                    onChange={(e) =>
                      handleStatChange("statProducts", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Customers Stat Label</label>
                  <input
                    type="text"
                    value={textContent.shoppingStat2Label}
                    onChange={(e) =>
                      handleTextChange("shoppingStat2Label", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Customers Stat Value</label>
                  <input
                    type="number"
                    value={textContent.statCustomers}
                    onChange={(e) =>
                      handleStatChange("statCustomers", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stores Stat Label</label>
                  <input
                    type="text"
                    value={textContent.shoppingStat3Label}
                    onChange={(e) =>
                      handleTextChange("shoppingStat3Label", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stores Stat Value</label>
                  <input
                    type="number"
                    value={textContent.statStores}
                    onChange={(e) =>
                      handleStatChange("statStores", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="section">
                <h3 className="section-title">📑 Section Titles</h3>
                <div className="form-group">
                  <label className="form-label">Categories Title</label>
                  <input
                    type="text"
                    value={textContent.shoppingCategoriesTitle}
                    onChange={(e) =>
                      handleTextChange(
                        "shoppingCategoriesTitle",
                        e.target.value,
                      )
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Products Title</label>
                  <input
                    type="text"
                    value={textContent.shoppingProductsTitle}
                    onChange={(e) =>
                      handleTextChange("shoppingProductsTitle", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Search Placeholder</label>
                  <input
                    type="text"
                    value={textContent.shoppingSearchPlaceholder}
                    onChange={(e) =>
                      handleTextChange(
                        "shoppingSearchPlaceholder",
                        e.target.value,
                      )
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="section">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="section-title mb-0">🏷️ Categories</h3>
                  <button
                    onClick={handleAddCategory}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                  >
                    + Add Category
                  </button>
                </div>
                {textContent.categories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="border border-gray-200 rounded-lg p-3 mb-3"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium text-sm">
                        Category {idx + 1}
                      </label>
                      <button
                        onClick={() => handleRemoveCategory(idx)}
                        className="text-red-500 text-xs hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cat.name}
                        onChange={(e) =>
                          handleCategoryChange(idx, "name", e.target.value)
                        }
                        placeholder="Name"
                        className="input-field text-sm"
                      />
                      <input
                        type="text"
                        value={cat.icon}
                        onChange={(e) =>
                          handleCategoryChange(idx, "icon", e.target.value)
                        }
                        placeholder="Icon"
                        className="input-field text-sm"
                      />
                      <input
                        type="text"
                        value={cat.slug}
                        onChange={(e) =>
                          handleCategoryChange(idx, "slug", e.target.value)
                        }
                        placeholder="Slug"
                        className="input-field text-sm col-span-2"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="section">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="section-title mb-0">📦 Products</h3>
                  <button
                    onClick={handleAddProduct}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                  >
                    + Add Product
                  </button>
                </div>
                {textContent.products.map((prod, idx) => (
                  <div
                    key={prod.id}
                    className="border border-gray-200 rounded-lg p-3 mb-3"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-medium text-sm">
                        Product {idx + 1}: {prod.name}
                      </label>
                      <button
                        onClick={() => handleRemoveProduct(idx)}
                        className="text-red-500 text-xs hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={prod.name}
                        onChange={(e) =>
                          handleProductChange(idx, "name", e.target.value)
                        }
                        placeholder="Name"
                        className="input-field text-sm"
                      />
                      <select
                        value={prod.category}
                        onChange={(e) =>
                          handleProductChange(idx, "category", e.target.value)
                        }
                        className="input-field text-sm"
                      >
                        {textContent.categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.01"
                        value={prod.price}
                        onChange={(e) =>
                          handleProductChange(
                            idx,
                            "price",
                            parseFloat(e.target.value),
                          )
                        }
                        placeholder="Price"
                        className="input-field text-sm"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={prod.oldPrice}
                        onChange={(e) =>
                          handleProductChange(
                            idx,
                            "oldPrice",
                            parseFloat(e.target.value),
                          )
                        }
                        placeholder="Old Price"
                        className="input-field text-sm"
                      />
                      <input
                        type="text"
                        value={prod.unit}
                        onChange={(e) =>
                          handleProductChange(idx, "unit", e.target.value)
                        }
                        placeholder="Unit"
                        className="input-field text-sm"
                      />
                      <input
                        type="text"
                        value={prod.image}
                        onChange={(e) =>
                          handleProductChange(idx, "image", e.target.value)
                        }
                        placeholder="Image URL"
                        className="input-field text-sm col-span-2"
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={prod.organic}
                          onChange={(e) =>
                            handleProductChange(
                              idx,
                              "organic",
                              e.target.checked,
                            )
                          }
                        />{" "}
                        Organic
                      </label>
                      <select
                        value={prod.rating}
                        onChange={(e) =>
                          handleProductChange(
                            idx,
                            "rating",
                            parseInt(e.target.value),
                          )
                        }
                        className="input-field text-sm"
                      >
                        <option value={5}>★★★★★ (5)</option>
                        <option value={4}>★★★★☆ (4)</option>
                        <option value={3}>★★★☆☆ (3)</option>
                        <option value={2}>★★☆☆☆ (2)</option>
                        <option value={1}>★☆☆☆☆ (1)</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* For Template 1 & 2 - Educational and Overlay */}
          {!isShoppingCart && (
            <>
              {/* Navigation Menu Editor */}
              <div className="section">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="section-title mb-0">
                    <DynamicIcon
                      name="FiMapPin"
                      size={18}
                      style={{ color: "#000000" }}
                    /> Navigation Menu
                  </h3>
                  <button
                    onClick={handleAddNavItem}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
                  >
                    + Add Menu Item
                  </button>
                </div>

                {textContent.navigationItems.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg text-gray-500">
                    No navigation items. Click "Add Menu Item" to create one.
                  </div>
                )}

                {textContent.navigationItems.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3 mb-3 bg-white"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium text-sm text-gray-600">
                          {item.type === "dropdown"
                            ? "📁 Dropdown Menu"
                            : "🔗 Link Menu"}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveNavItem(index)}
                        className="text-red-500 text-xs hover:text-red-700 transition px-2 py-1 rounded hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Menu Name (Identifier)
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) =>
                            handleNavigationNameChange(index, e.target.value)
                          }
                          className="input-field text-sm"
                          placeholder="e.g., About Us"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Display Label
                        </label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            handleNavigationChange(index, e.target.value)
                          }
                          className="input-field text-sm"
                          placeholder="e.g., About Us"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Menu Type
                      </label>
                      <select
                        value={item.type}
                        onChange={(e) =>
                          handleNavigationTypeChange(index, e.target.value)
                        }
                        className="input-field text-sm"
                      >
                        <option value="link">🔗 Link (Single Page)</option>
                        <option value="dropdown">
                          📁 Dropdown (With Submenu)
                        </option>
                      </select>
                    </div>

                    {/* Dropdown Items */}
                    {item.type === "dropdown" && (
                      <div className="ml-4 mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-400">
                        <div className="flex justify-between items-center mb-3">
                          <label className="flex items-center gap-2 font-medium text-sm text-gray-700">
                            <DynamicIcon
                              name="SlNotebook"
                              size={15}
                              style={{ color: "#000000" }}
                            />
                            <span>Dropdown Items</span>
                          </label>
                          <button
                            onClick={() => handleAddDropdownItem(index)}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition flex items-center gap-1"
                          >
                            + Add Item
                          </button>
                        </div>
                        <div className="space-y-2">
                          {item.menuItems &&
                            item.menuItems.map((menuItem, menuIndex) => (
                              <div
                                key={menuIndex}
                                className="flex gap-2 items-center"
                              >
                                <span className="text-gray-400 text-xs w-5">
                                  {menuIndex + 1}.
                                </span>
                                <input
                                  type="text"
                                  value={menuItem}
                                  onChange={(e) =>
                                    handleDropdownItemsChange(
                                      index,
                                      menuIndex,
                                      e.target.value,
                                    )
                                  }
                                  className="input-field text-sm flex-1"
                                  placeholder={`Dropdown item ${menuIndex + 1}`}
                                />
                                <button
                                  onClick={() =>
                                    handleRemoveDropdownItem(index, menuIndex)
                                  }
                                  className="text-red-500 text-xs hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition"
                                  title="Remove item"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                        </div>
                        {(!item.menuItems || item.menuItems.length === 0) && (
                          <div className="text-center py-3 text-gray-400 text-xs">
                            No dropdown items. Click "Add Item" to create one.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Live Preview */}
                {textContent.navigationItems.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <h4 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-2">
                      <span>
                        <DynamicIcon
                          name="FiEye"
                          size={18}
                          style={{ color: "#000000" }}
                        />
                      </span> Live Preview
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {textContent.navigationItems.map((item, idx) => (
                        <div key={idx} className="relative group">
                          <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-400 transition">
                            {item.label}
                            {item.type === "dropdown" && (
                              <span className="ml-1 text-xs">▼</span>
                            )}
                          </button>
                          {item.type === "dropdown" &&
                            item.menuItems &&
                            item.menuItems.length > 0 && (
                              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[150px]">
                                {item.menuItems.map((subItem, subIdx) => (
                                  <div
                                    key={subIdx}
                                    className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded"
                                  >
                                    {subItem}
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Home Section */}
              <div className="section">
                <h3 className="section-title">
                  <DynamicIcon
                    name="FiHome"
                    size={20}
                    style={{ color: "#000000" }}
                  />
                  Home Section
                </h3>
                <div className="form-group">
                  <label className="form-label">Tagline / Title</label>
                  <input
                    type="text"
                    value={textContent.homeTagline}
                    onChange={(e) =>
                      handleTextChange("homeTagline", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={textContent.homeDescription}
                    onChange={(e) =>
                      handleTextChange("homeDescription", e.target.value)
                    }
                    className="textarea-field"
                    rows="3"
                  />
                </div>

                {isOverlayDesign && (
                  <div className="form-group">
                    <label className="form-label">
                      Hero Background Image URL
                    </label>
                    <input
                      type="text"
                      value={textContent.homeImage}
                      onChange={(e) =>
                        handleTextChange("homeImage", e.target.value)
                      }
                      className="input-field"
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    <div className="color-description">
                      Enter the URL of the hero background image
                    </div>
                    {textContent.homeImage && (
                      <div className="mt-2">
                        <img
                          src={textContent.homeImage}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg mt-2 border border-gray-200"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {!isOverlayDesign && (
                  <div className="form-group">
                    <label className="form-label">Subtitle</label>
                    <input
                      type="text"
                      value={textContent.homeSubtitle}
                      onChange={(e) =>
                        handleTextChange("homeSubtitle", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Primary CTA Button</label>
                  <input
                    type="text"
                    value={textContent.homePrimaryCta}
                    onChange={(e) =>
                      handleTextChange("homePrimaryCta", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
              </div>

              {/* About Section */}
              <div className="section">
                <h3 className="section-title">
                  <DynamicIcon
                    name="FaBookOpen"
                    size={20}
                    style={{ color: "#000000" }}
                  />
                  About Section
                </h3>
                <div className="form-group">
                  <label className="form-label">Section Title</label>
                  <input
                    type="text"
                    value={textContent.aboutTitle}
                    onChange={(e) =>
                      handleTextChange("aboutTitle", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Our Vision</label>
                  <textarea
                    value={textContent.aboutVision}
                    onChange={(e) =>
                      handleTextChange("aboutVision", e.target.value)
                    }
                    className="textarea-field"
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Leadership</label>
                  <textarea
                    value={textContent.aboutLeadership}
                    onChange={(e) =>
                      handleTextChange("aboutLeadership", e.target.value)
                    }
                    className="textarea-field"
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">History</label>
                  <textarea
                    value={textContent.aboutHistory}
                    onChange={(e) =>
                      handleTextChange("aboutHistory", e.target.value)
                    }
                    className="textarea-field"
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Campus Life</label>
                  <textarea
                    value={textContent.aboutCampusLife}
                    onChange={(e) =>
                      handleTextChange("aboutCampusLife", e.target.value)
                    }
                    className="textarea-field"
                    rows="2"
                  />
                </div>
              </div>

              {/* Courses Section */}
              <div className="section">
                <h3 className="section-title">
                  <DynamicIcon
                    name="FaGraduationCap"
                    size={23}
                    style={{ color: "#000000" }}
                  />
                  Courses Section
                </h3>
                <div className="form-group">
                  <label className="form-label">Section Title</label>
                  <input
                    type="text"
                    value={textContent.coursesTitle}
                    onChange={(e) =>
                      handleTextChange("coursesTitle", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Engineering</label>
                  <textarea
                    value={textContent.coursesEngineering}
                    onChange={(e) =>
                      handleTextChange("coursesEngineering", e.target.value)
                    }
                    className="textarea-field"
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Management</label>
                  <textarea
                    value={textContent.coursesManagement}
                    onChange={(e) =>
                      handleTextChange("coursesManagement", e.target.value)
                    }
                    className="textarea-field"
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Data Science</label>
                  <textarea
                    value={textContent.coursesDataScience}
                    onChange={(e) =>
                      handleTextChange("coursesDataScience", e.target.value)
                    }
                    className="textarea-field"
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Design</label>
                  <textarea
                    value={textContent.coursesDesign}
                    onChange={(e) =>
                      handleTextChange("coursesDesign", e.target.value)
                    }
                    className="textarea-field"
                    rows="2"
                  />
                </div>
              </div>

              {/* Achievements Section */}
              <div className="section">
                <h3 className="section-title">
                  <DynamicIcon
                    name="IoIosTrophy"
                    size={23}
                    style={{ color: "#000000" }}
                  /> Achievements Section
                </h3>
                <div className="form-group">
                  <label className="form-label">Section Title</label>
                  <input
                    type="text"
                    value={textContent.achievementsTitle}
                    onChange={(e) =>
                      handleTextChange("achievementsTitle", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                {textContent.achievementsList.map((achievement, index) => (
                  <div key={index} className="achievement-item">
                    <label className="achievement-label">
                      Achievement {index + 1}
                    </label>
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) =>
                        handleAchievementChange(index, e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                ))}
              </div>

              {/* Contact Section */}
              <div className="section">
                <h3 className="section-title">
                  <DynamicIcon
                    name="FiPhone"
                    size={23}
                    style={{ color: "#000000" }}
                  /> Contact Section
                </h3>
                <div className="form-group">
                  <label className="form-label">Section Title</label>
                  <input
                    type="text"
                    value={textContent.contactTitle}
                    onChange={(e) =>
                      handleTextChange("contactTitle", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    value={textContent.contactAddress}
                    onChange={(e) =>
                      handleTextChange("contactAddress", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    value={textContent.contactPhone}
                    onChange={(e) =>
                      handleTextChange("contactPhone", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={textContent.contactEmail}
                    onChange={(e) =>
                      handleTextChange("contactEmail", e.target.value)
                    }
                    className="input-field"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomizationPanel;