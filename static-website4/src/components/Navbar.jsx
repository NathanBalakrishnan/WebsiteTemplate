import { useState } from "react";

export default function Navbar({
  navData,
  themesData,
  activeTab,
  templateData,
  setActiveTab,
  currentTheme,
  setTheme,
  themeScope,
  headerBg,
  logoColor,
  menuColor,
  menuHoverColor,
  // isOverlayDesign,
  accentColor,
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null);

  const handleMobileNavClick = (item) => {
    if (item.type === "dropdown") {
      setActiveMobileSubmenu(
        activeMobileSubmenu === item.name ? null : item.name,
      );
    } else {
      setActiveTab(item.name);
      setIsMobileMenuOpen(false);
      setActiveMobileSubmenu(null);
    }
  };

  const handleMobileSubmenuItemClick = (parentName) => {
    setActiveTab(parentName);
    setIsMobileMenuOpen(false);
  };

  // Get navbar background based on theme scope
  const navbarBg = themeScope === "header-footer" ? headerBg : "transparent";
  const textColor = menuColor;
  const hoverColor = menuHoverColor;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        themeScope === "header-footer" ? "shadow-lg" : ""
      }`}
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
          {templateData.title}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navData.map((item, index) => {
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={`absolute top-full left-0 mt-3 min-w-[220px] z-[9999] ${
                    themeScope === "header-footer"
                      ? "bg-white shadow-2xl border border-gray-200"
                      : "bg-black/90 backdrop-blur-md border border-white/10"
                  } rounded-xl py-2 transition-all duration-200 origin-top ${
                    isOpen
                      ? "opacity-100 scale-100 visible"
                      : "opacity-0 scale-95 invisible"
                  }`}
                >
                  {item.menuItems.map((sub, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => {
                        setActiveTab(item.label);
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
              className={`absolute top-full right-0 mt-2 w-48 ${
                themeScope === "header-footer"
                  ? "bg-white shadow-xl border border-gray-100"
                  : "bg-black/90 backdrop-blur-lg border border-white/10"
              } rounded-lg py-2 transition-all duration-150 ${
                showThemeMenu
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 invisible"
              }`}
            >
              {themesData.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`block w-full text-left px-4 py-2 text-xs font-medium transition-colors border-none bg-transparent cursor-pointer ${
                    currentTheme === t.id
                      ? themeScope === "header-footer"
                        ? "text-blue-600 bg-blue-50"
                        : "text-cyan-400 bg-white/10"
                      : themeScope === "header-footer"
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {t.name} {currentTheme === t.id && "✓"}
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
            <span
              className={`w-full h-0.5 rounded-full transition-all duration-300 origin-left ${
                isMobileMenuOpen ? "rotate-45 translate-x-1" : ""
              }`}
              style={{ backgroundColor: textColor }}
            />
            <span
              className={`w-full h-0.5 rounded-full transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0 scale-0" : ""
              }`}
              style={{ backgroundColor: textColor }}
            />
            <span
              className={`w-full h-0.5 rounded-full transition-all duration-300 origin-left ${
                isMobileMenuOpen ? "-rotate-45 translate-x-1" : ""
              }`}
              style={{ backgroundColor: textColor }}
            />
          </div>
        </button>

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 ${
            themeScope === "header-footer"
              ? "bg-white"
              : "bg-black/95 backdrop-blur-2xl"
          } z-40 md:hidden flex flex-col justify-between p-8 pt-24 transition-all mt-5 duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="flex flex-col space-y-2 overflow-y-auto max-h-[62vh] pr-2 text-left mt-4">
            {navData.map((item, index) => {
              const isSubmenuOpen = activeMobileSubmenu === item.name;
              return (
                <div
                  key={index}
                  className={`border-b py-2.5 last:border-none ${
                    themeScope === "header-footer"
                      ? "border-gray-200"
                      : "border-white/5"
                  }`}
                >
                  <button
                    onClick={() => handleMobileNavClick(item)}
                    className="text-lg font-light tracking-tight bg-transparent border-none py-1.5 cursor-pointer w-full flex justify-between items-center text-left transition-colors"
                    style={{
                      color:
                        activeTab === item.name
                          ? themeScope === "header-footer"
                            ? hoverColor
                            : accentColor
                          : themeScope === "header-footer"
                            ? "rgba(0,0,0,0.85)"
                            : "rgba(255,255,255,0.95)",
                    }}
                  >
                    <span>{item.name}</span>
                    {item.type === "dropdown" && (
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          themeScope === "header-footer"
                            ? "text-gray-400"
                            : "text-white/40"
                        } ${isSubmenuOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>

                  {item.type === "dropdown" && (
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isSubmenuOpen
                          ? "max-h-40 opacity-100 mt-2.5 mb-1"
                          : "max-h-0 opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="flex flex-wrap gap-2 pl-1">
                        {item.menuItems.map((sub, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() =>
                              handleMobileSubmenuItemClick(item.name)
                            }
                            className={`text-xs rounded-md px-3 py-1.5 transition-all cursor-pointer font-medium ${
                              themeScope === "header-footer"
                                ? "bg-gray-100 active:bg-gray-200 text-gray-700 border border-gray-200"
                                : "bg-white/5 active:bg-white/20 text-white/70 border border-white/10"
                            }`}
                          >
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
          <div
            className={`border-t pt-5 ${
              themeScope === "header-footer"
                ? "border-gray-200 bg-gray-50"
                : "border-white/10 bg-black/40"
            }`}
          >
            <span
              className={`text-[10px] uppercase tracking-widest font-bold block mb-3 text-left ${
                themeScope === "header-footer"
                  ? "text-gray-500"
                  : "text-white/40"
              }`}
            >
              Select Theme
            </span>
            <div className="grid grid-cols-3 gap-2">
              {themesData.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`py-2 rounded-lg text-[11px] font-semibold text-center border cursor-pointer transition-all ${
                    currentTheme === t.id
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
