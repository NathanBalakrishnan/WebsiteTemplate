// import { useState } from "react";

// export default function Navbar({
//   navData,
//   themesData,
//   activeTab,
//   templateData,
//   setActiveTab,
//   currentTheme,
//   setTheme,
//   themeScope,
//   headerBg,
//   logoColor,
//   menuColor,
//   menuHoverColor,
//   // isOverlayDesign,
//   accentColor,
// }) {
//   const [openDropdown, setOpenDropdown] = useState(null);
//   const [showThemeMenu, setShowThemeMenu] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null);

//   const handleMobileNavClick = (item) => {
//     if (item.type === "dropdown") {
//       setActiveMobileSubmenu(
//         activeMobileSubmenu === item.name ? null : item.name,
//       );
//     } else {
//       setActiveTab(item.name);
//       setIsMobileMenuOpen(false);
//       setActiveMobileSubmenu(null);
//     }
//   };

//   const handleMobileSubmenuItemClick = (parentName) => {
//     setActiveTab(parentName);
//     setIsMobileMenuOpen(false);
//   };

//   // Get navbar background based on theme scope
//   const navbarBg = themeScope === "header-footer" ? headerBg : "transparent";
//   const textColor = menuColor;
//   const hoverColor = menuHoverColor;

//   return (
//     <nav
//       className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
//         themeScope === "header-footer" ? "shadow-lg" : ""
//       }`}
//       style={{
//         background: navbarBg,
//         height: "80px",
//       }}
//     >
//       <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 flex justify-between items-center h-full">
//         {/* Brand/Logo */}
//         <div
//           className="text-xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity relative z-50"
//           style={{ color: logoColor }}
//           onClick={() => {
//             setActiveTab("Home");
//             setIsMobileMenuOpen(false);
//           }}
//         >
//           {templateData.title}
//         </div>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-6">
//           {navData.map((item, index) => {
//             if (item.type === "link") {
//               return (
//                 <button
//                   key={index}
//                   onClick={() => setActiveTab(item.name)} // Changed from item.label to item.name
//                   className="text-sm font-medium transition-colors cursor-pointer border-none bg-transparent"
//                   style={{
//                     color: activeTab === item.name ? hoverColor : textColor, // Changed from item.label to item.name
//                     fontWeight: activeTab === item.name ? "600" : "500",
//                   }}
//                 >
//                   {item.label} {/* Changed from item.label to item.name */}
//                 </button>
//               );
//             }

//             const isOpen = openDropdown === item.name;
//             return (
//               <div
//                 key={index}
//                 className="relative"
//                 onMouseEnter={() => setOpenDropdown(item.name)}
//                 onMouseLeave={() => setOpenDropdown(null)}
//               >
//                 <button
//                   className="text-sm font-medium flex items-center cursor-pointer border-none bg-transparent"
//                   style={{ color: textColor }}
//                 >
//                   {item.label} {/* Changed from item.label to item.name */}
//                   <svg
//                     className={`w-3 h-3 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2.5"
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>

//                 <div
//                   className={`absolute top-full left-0 mt-3 min-w-[220px] z-[9999] ${
//                     themeScope === "header-footer"
//                       ? "bg-white shadow-2xl border border-gray-200"
//                       : "bg-black/90 backdrop-blur-md border border-white/10"
//                   } rounded-xl py-2 transition-all duration-200 origin-top ${
//                     isOpen
//                       ? "opacity-100 scale-100 visible"
//                       : "opacity-0 scale-95 invisible"
//                   }`}
//                 >
//                   {item.menuItems.map((sub, sIdx) => (
//                     <button
//                       key={sIdx}
//                       onClick={() => {
//                         setActiveTab(item.name); // Changed from item.label to item.name
//                         setOpenDropdown(null);
//                       }}
//                       className={`w-full text-left px-5 py-3 text-sm transition-all duration-200 border-none bg-transparent cursor-pointer ${
//                         themeScope === "header-footer"
//                           ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//                           : "text-white/80 hover:bg-white/10 hover:text-white"
//                       }`}
//                     >
//                       {sub}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//           {/* Theme Selector */}
//           <div
//             className="relative ml-4"
//             onMouseEnter={() => setShowThemeMenu(true)}
//             onMouseLeave={() => setShowThemeMenu(false)}
//           >
//             <button
//               className="text-xs uppercase tracking-widest font-semibold px-4 py-2 rounded-md transition-all cursor-pointer"
//               style={{
//                 border: `1px solid ${textColor}40`,
//                 color: textColor,
//                 background: `${textColor}10`,
//               }}
//             >
//               Themes
//             </button>
//             <div
//               className={`absolute top-full right-0 mt-2 min-w-[150px] ${
//                 themeScope === "header-footer"
//                   ? "bg-white shadow-xl border border-gray-100"
//                   : "bg-black/90 backdrop-blur-lg border border-white/10"
//               } rounded-lg py-2 transition-all duration-150 ${
//                 showThemeMenu
//                   ? "opacity-100 scale-100 visible"
//                   : "opacity-0 scale-95 invisible"
//               }`}
//             >
//               {themesData.map((t) => (
//                 <button
//                   key={t.id}
//                   onClick={() => setTheme(t.id)}
//                   className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors border-none bg-transparent cursor-pointer ${
//                     currentTheme === t.id
//                       ? themeScope === "header-footer"
//                         ? "text-blue-600 bg-blue-50"
//                         : "text-cyan-400 bg-white/10"
//                       : themeScope === "header-footer"
//                         ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                         : "text-white/70 hover:text-white hover:bg-white/10"
//                   }`}
//                 >
//                   {t.name} {currentTheme === t.id && "✓"}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Mobile menu button */}
//         <button
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="md:hidden relative z-50 p-2 bg-transparent border-none cursor-pointer focus:outline-none flex items-center justify-center"
//         >
//           <div className="w-6 h-5 relative flex flex-col justify-between">
//             <span
//               className={`w-full h-0.5 rounded-full transition-all duration-300 origin-left ${
//                 isMobileMenuOpen ? "rotate-45 translate-x-1" : ""
//               }`}
//               style={{ backgroundColor: textColor }}
//             />
//             <span
//               className={`w-full h-0.5 rounded-full transition-all duration-300 ${
//                 isMobileMenuOpen ? "opacity-0 scale-0" : ""
//               }`}
//               style={{ backgroundColor: textColor }}
//             />
//             <span
//               className={`w-full h-0.5 rounded-full transition-all duration-300 origin-left ${
//                 isMobileMenuOpen ? "-rotate-45 translate-x-1" : ""
//               }`}
//               style={{ backgroundColor: textColor }}
//             />
//           </div>
//         </button>

//         {/* Mobile menu */}
//         <div
//           className={`fixed inset-0 ${
//             themeScope === "header-footer"
//               ? "bg-white"
//               : "bg-black/95 backdrop-blur-2xl"
//           } z-40 md:hidden flex flex-col justify-between p-8 pt-24 transition-all mt-5 duration-300 ease-in-out ${
//             isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
//           }`}
//         >
//           <div className="flex flex-col space-y-2 overflow-y-auto max-h-[62vh] pr-2 text-left mt-4">
//             {navData.map((item, index) => {
//               const isSubmenuOpen = activeMobileSubmenu === item.name;
//               return (
//                 <div
//                   key={index}
//                   className={`border-b py-2.5 last:border-none ${
//                     themeScope === "header-footer"
//                       ? "border-gray-200"
//                       : "border-white/5"
//                   }`}
//                 >
//                   <button
//                     onClick={() => handleMobileNavClick(item)}
//                     className="text-lg font-light tracking-tight bg-transparent border-none py-1.5 cursor-pointer w-full flex justify-between items-center text-left transition-colors"
//                     style={{
//                       color:
//                         activeTab === item.name
//                           ? themeScope === "header-footer"
//                             ? hoverColor
//                             : accentColor
//                           : themeScope === "header-footer"
//                             ? "rgba(0,0,0,0.85)"
//                             : "rgba(255,255,255,0.95)",
//                     }}
//                   >
//                     <span>{item.name}</span>
//                     {item.type === "dropdown" && (
//                       <svg
//                         className={`w-4 h-4 transition-transform duration-200 ${
//                           themeScope === "header-footer"
//                             ? "text-gray-400"
//                             : "text-white/40"
//                         } ${isSubmenuOpen ? "rotate-180" : ""}`}
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M19 9l-7 7-7-7"
//                         />
//                       </svg>
//                     )}
//                   </button>

//                   {item.type === "dropdown" && (
//                     <div
//                       className={`transition-all duration-300 ease-in-out overflow-hidden ${
//                         isSubmenuOpen
//                           ? "max-h-40 opacity-100 mt-2.5 mb-1"
//                           : "max-h-0 opacity-0 pointer-events-none"
//                       }`}
//                     >
//                       <div className="flex flex-wrap gap-2 pl-1">
//                         {item.menuItems.map((sub, sIdx) => (
//                           <button
//                             key={sIdx}
//                             onClick={() =>
//                               handleMobileSubmenuItemClick(item.name)
//                             }
//                             className={`text-xs rounded-md px-3 py-1.5 transition-all cursor-pointer font-medium ${
//                               themeScope === "header-footer"
//                                 ? "bg-gray-100 active:bg-gray-200 text-gray-700 border border-gray-200"
//                                 : "bg-white/5 active:bg-white/20 text-white/70 border border-white/10"
//                             }`}
//                           >
//                             {sub}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* Theme selector in mobile */}
//           <div
//             className={`border-t pt-5 ${
//               themeScope === "header-footer"
//                 ? "border-gray-200 bg-gray-50"
//                 : "border-white/10 bg-black/40"
//             }`}
//           >
//             <span
//               className={`text-[10px] uppercase tracking-widest font-bold block mb-3 text-left ${
//                 themeScope === "header-footer"
//                   ? "text-gray-500"
//                   : "text-white/40"
//               }`}
//             >
//               Select Theme
//             </span>
//             <div className="grid grid-cols-3 gap-2">
//               {themesData.map((t) => (
//                 <button
//                   key={t.id}
//                   onClick={() => {
//                     setTheme(t.id);
//                     setIsMobileMenuOpen(false);
//                   }}
//                   className={`py-2 rounded-lg text-[11px] font-semibold text-center border cursor-pointer transition-all ${
//                     currentTheme === t.id
//                       ? themeScope === "header-footer"
//                         ? "bg-blue-600 text-white border-blue-600 shadow-md font-bold"
//                         : "bg-white text-black border-white shadow-md font-bold"
//                       : themeScope === "header-footer"
//                         ? "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
//                         : "bg-white/5 text-white/70 border-white/10"
//                   }`}
//                 >
//                   {t.name.split(" ")[0]}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';

function Navbar({
  // Common props
  currentPage,
  setPage,
  theme,
  setTheme,
  themes,
  cartCount,
  search,
  setSearch,
  // Educational/Overlay template props
  navData,
  themesData,
  activeTab,
  templateData,
  setActiveTab,
  currentTheme,
  themeScope,
  headerBg,
  logoColor,
  menuColor,
  menuHoverColor,
  accentColor,
  // isOverlayDesign,
  // Shopping cart specific
  isShoppingCart = false
}) {
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null);
  const themeRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsThemeOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get current theme name and color
  const getThemeColor = (themeId) => {
    switch(themeId) {
      case 'teal': return '#14b8a6';
      case 'teal-coast': return '#14b8a6';
      case 'purple': return '#8b5cf6';
      case 'midnight-neon': return '#8b5cf6';
      case 'orange': return '#f97316';
      case 'sunset-warmth': return '#f97316';
      case 'classic': return '#1e3a8a';
      case 'emerald': return '#065f46';
      case 'crimson': return '#991b1b';
      default: return '#14b8a6';
    }
  };

  const currentThemeName = themes?.find(t => t.id === theme) || themesData?.find(t => t.id === currentTheme);
  
  // Determine navbar background
  const navbarBg = isShoppingCart 
    ? 'bg-black/50 backdrop-blur-md' 
    : (themeScope === "header-footer" ? headerBg : "transparent");

  const textColor = isShoppingCart ? 'text-white/80' : menuColor;
  const hoverColor = isShoppingCart ? 'text-white' : menuHoverColor;

  // Handle page/tab changes
  const handleSetPage = (page) => {
    if (setPage) {
      setPage(page);
    }
    if (setActiveTab) {
      setActiveTab(page === 'home' ? 'Home' : page === 'cart' ? 'Cart' : page);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSetTheme = (newTheme) => {
    if (setTheme) {
      setTheme(newTheme);
    }
    if (setTheme) {
      setTheme(newTheme);
    }
    setIsThemeOpen(false);
    setShowThemeMenu(false);
  };

  // Shopping Cart Navigation
  if (isShoppingCart) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center flex-wrap gap-3">
            {/* Logo */}
            <button 
              onClick={() => handleSetPage('home')} 
              className="text-xl md:text-2xl font-bold text-white bg-transparent border-none cursor-pointer hover:opacity-80 transition flex items-center gap-1"
            >
              🌿 <span className="hidden sm:inline">Organic</span><span className="text-accent">Grocery</span>
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-3 items-center flex-wrap">
              <button 
                onClick={() => handleSetPage('home')} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${currentPage === 'home' ? 'bg-accent text-white shadow-lg' : 'text-white/80 hover:bg-white/10'}`}
              >
                Home
              </button>
              
              <button 
                onClick={() => handleSetPage('cart')} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition relative ${currentPage === 'cart' ? 'bg-accent text-white shadow-lg' : 'text-white/80 hover:bg-white/10'}`}
              >
                Cart 
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {/* Theme Dropdown */}
              <div className="relative" ref={themeRef}>
                <button
                  onClick={() => setIsThemeOpen(!isThemeOpen)}
                  className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-full flex items-center gap-2 transition cursor-pointer min-w-[150px] justify-between border border-white/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: getThemeColor(theme) }} />
                    <span className="font-medium text-sm">{currentThemeName?.name || 'Select Theme'}</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${isThemeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isThemeOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-black/95 backdrop-blur-md rounded-xl shadow-2xl py-2 border border-white/20 z-50 overflow-hidden animate-fade-in-up">
                    {(themes || themesData).map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleSetTheme(t.id)}
                        className={`w-full text-left px-4 py-3 text-sm transition flex items-center gap-3 ${
                          theme === t.id || currentTheme === t.id
                            ? 'bg-accent/20 text-accent' 
                            : 'text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: getThemeColor(t.id) }} />
                        <span className="flex-1 font-medium">{t.name}</span>
                        {(theme === t.id || currentTheme === t.id) && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Search Input */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white/15 text-white px-4 py-2 rounded-full border border-white/20 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent placeholder:text-white/50 w-56 transition pl-10" 
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button onClick={() => handleSetPage('cart')} className="relative p-2 text-white hover:bg-white/10 rounded-full transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 18v3" />
                </svg>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{cartCount}</span>}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="mobile-menu-button p-2 text-white hover:bg-white/10 rounded-full transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div ref={mobileMenuRef} className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-3 animate-fade-in-up">
              <div className="relative">
                <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/15 text-white px-4 py-2.5 rounded-full border border-white/20 focus:outline-none focus:border-accent placeholder:text-white/50 pl-10" />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button onClick={() => { handleSetPage('home'); setIsMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-medium transition ${currentPage === 'home' ? 'bg-accent text-white' : 'text-white/80 hover:bg-white/10'}`}>
                Home
              </button>
              <button onClick={() => { handleSetPage('cart'); setIsMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 rounded-full text-sm font-medium transition flex items-center justify-between ${currentPage === 'cart' ? 'bg-accent text-white' : 'text-white/80 hover:bg-white/10'}`}>
                Cart {cartCount > 0 && <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">{cartCount} items</span>}
              </button>
              <div className="space-y-2 pt-2">
                <div className="text-white/60 text-xs px-2">SELECT THEME</div>
                <div className="grid grid-cols-3 gap-2">
                  {(themes || themesData).map(t => (
                    <button key={t.id} onClick={() => { handleSetTheme(t.id); setIsMobileMenuOpen(false); }}
                      className={`px-3 py-2 rounded-full text-xs font-medium transition flex items-center justify-center gap-2 ${theme === t.id || currentTheme === t.id ? 'bg-accent text-white shadow-lg' : 'bg-white/15 text-white/80 hover:bg-white/25'}`}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getThemeColor(t.id) }} />
                      {t.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Educational/Overlay Template Navigation
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${themeScope === "header-footer" ? "shadow-lg" : ""}`}
      style={{
        background: navbarBg,
        height: "80px",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 flex justify-between items-center h-full">
        {/* Brand/Logo */}
        <div
          className="text-xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity relative z-50"
          style={{ color: logoColor }}
          onClick={() => {
            setActiveTab("Home");
            setIsMobileMenuOpen(false);
          }}
        >
          {templateData?.title || "Template"}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navData?.map((item, index) => {
            if (item.type === "link") {
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(item.name)}
                  className="text-sm font-medium transition-colors cursor-pointer border-none bg-transparent"
                  style={{
                    color: activeTab === item.name ? hoverColor : textColor,
                    fontWeight: activeTab === item.name ? "600" : "500",
                  }}
                >
                  {item.label}
                </button>
              );
            }

            const isOpen = openDropdown === item.name;
            return (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className="text-sm font-medium flex items-center cursor-pointer border-none bg-transparent"
                  style={{ color: textColor }}
                >
                  {item.label}
                  <svg
                    className={`w-3 h-3 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`absolute top-full left-0 mt-3 min-w-[220px] z-[9999] ${
                    themeScope === "header-footer"
                      ? "bg-white shadow-2xl border border-gray-200"
                      : "bg-black/90 backdrop-blur-md border border-white/10"
                  } rounded-xl py-2 transition-all duration-200 origin-top ${
                    isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                  }`}
                >
                  {item.menuItems.map((sub, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => {
                        setActiveTab(item.name);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-5 py-3 text-sm transition-all duration-200 border-none bg-transparent cursor-pointer ${
                        themeScope === "header-footer"
                          ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* Theme Selector */}
          <div
            className="relative ml-4"
            onMouseEnter={() => setShowThemeMenu(true)}
            onMouseLeave={() => setShowThemeMenu(false)}
          >
            <button
              className="text-xs uppercase tracking-widest font-semibold px-4 py-2 rounded-md transition-all cursor-pointer"
              style={{
                border: `1px solid ${textColor}40`,
                color: textColor,
                background: `${textColor}10`,
              }}
            >
              Themes
            </button>
            <div
              className={`absolute top-full right-0 mt-2 min-w-[150px] ${
                themeScope === "header-footer"
                  ? "bg-white shadow-xl border border-gray-100"
                  : "bg-black/90 backdrop-blur-lg border border-white/10"
              } rounded-lg py-2 transition-all duration-150 ${
                showThemeMenu ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
              }`}
            >
              {(themesData || themes).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors border-none bg-transparent cursor-pointer ${
                    (currentTheme === t.id || theme === t.id)
                      ? themeScope === "header-footer"
                        ? "text-blue-600 bg-blue-50"
                        : "text-cyan-400 bg-white/10"
                      : themeScope === "header-footer"
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {t.name} {(currentTheme === t.id || theme === t.id) && "✓"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden relative z-50 p-2 bg-transparent border-none cursor-pointer focus:outline-none flex items-center justify-center"
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span className={`w-full h-0.5 rounded-full transition-all duration-300 origin-left ${isMobileMenuOpen ? "rotate-45 translate-x-1" : ""}`} style={{ backgroundColor: textColor }} />
            <span className={`w-full h-0.5 rounded-full transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 scale-0" : ""}`} style={{ backgroundColor: textColor }} />
            <span className={`w-full h-0.5 rounded-full transition-all duration-300 origin-left ${isMobileMenuOpen ? "-rotate-45 translate-x-1" : ""}`} style={{ backgroundColor: textColor }} />
          </div>
        </button>

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 ${
            themeScope === "header-footer" ? "bg-white" : "bg-black/95 backdrop-blur-2xl"
          } z-40 md:hidden flex flex-col justify-between p-8 pt-24 transition-all mt-5 duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="flex flex-col space-y-2 overflow-y-auto max-h-[62vh] pr-2 text-left mt-4">
            {navData?.map((item, index) => {
              const isSubmenuOpen = activeMobileSubmenu === item.name;
              return (
                <div key={index} className={`border-b py-2.5 last:border-none ${themeScope === "header-footer" ? "border-gray-200" : "border-white/5"}`}>
                  <button
                    onClick={() => {
                      if (item.type === "dropdown") {
                        setActiveMobileSubmenu(activeMobileSubmenu === item.name ? null : item.name);
                      } else {
                        setActiveTab(item.name);
                        setIsMobileMenuOpen(false);
                        setActiveMobileSubmenu(null);
                      }
                    }}
                    className="text-lg font-light tracking-tight bg-transparent border-none py-1.5 cursor-pointer w-full flex justify-between items-center text-left transition-colors"
                    style={{
                      color: activeTab === item.name
                        ? themeScope === "header-footer" ? hoverColor : accentColor
                        : themeScope === "header-footer" ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.95)",
                    }}
                  >
                    <span>{item.name}</span>
                    {item.type === "dropdown" && (
                      <svg className={`w-4 h-4 transition-transform duration-200 ${themeScope === "header-footer" ? "text-gray-400" : "text-white/40"} ${isSubmenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {item.type === "dropdown" && (
                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isSubmenuOpen ? "max-h-40 opacity-100 mt-2.5 mb-1" : "max-h-0 opacity-0 pointer-events-none"}`}>
                      <div className="flex flex-wrap gap-2 pl-1">
                        {item.menuItems.map((sub, sIdx) => (
                          <button key={sIdx} onClick={() => { setActiveTab(item.name); setIsMobileMenuOpen(false); }}
                            className={`text-xs rounded-md px-3 py-1.5 transition-all cursor-pointer font-medium ${
                              themeScope === "header-footer"
                                ? "bg-gray-100 active:bg-gray-200 text-gray-700 border border-gray-200"
                                : "bg-white/5 active:bg-white/20 text-white/70 border border-white/10"
                            }`}>
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Theme selector in mobile */}
          <div className={`border-t pt-5 ${themeScope === "header-footer" ? "border-gray-200 bg-gray-50" : "border-white/10 bg-black/40"}`}>
            <span className={`text-[10px] uppercase tracking-widest font-bold block mb-3 text-left ${themeScope === "header-footer" ? "text-gray-500" : "text-white/40"}`}>Select Theme</span>
            <div className="grid grid-cols-3 gap-2">
              {(themesData || themes).map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); setIsMobileMenuOpen(false); }}
                  className={`py-2 rounded-lg text-[11px] font-semibold text-center border cursor-pointer transition-all ${
                    (currentTheme === t.id || theme === t.id)
                      ? themeScope === "header-footer"
                        ? "bg-blue-600 text-white border-blue-600 shadow-md font-bold"
                        : "bg-white text-black border-white shadow-md font-bold"
                      : themeScope === "header-footer"
                        ? "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                        : "bg-white/5 text-white/70 border-white/10"
                  }`}
                >
                  {t.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;