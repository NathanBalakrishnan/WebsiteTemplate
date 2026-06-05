import { useState, useEffect } from 'react';
import siteData from '../../data/multisiteData.json';
import Navbar from '../../components/Navbar';
import Home from '../preview/Home';
import About from '../preview/About';
import Courses from '../preview/Courses';
import Achievements from '../preview/Achievements';
import Contact from '../preview/Contact';
import "../../assets/css/PreviewTemplate.css";
import { useLocation } from "react-router-dom";

export default function CustomizedParent() {
  const [activeTab, setActiveTab] = useState('Home');
  const [theme, setTheme] = useState('classic');
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
  
  const location = useLocation();
  
  const selectedTemplateId = location.state?.templateId;
  const selectedTemplate = siteData.find(
    (template) => template.templateId === selectedTemplateId
  );
  
  useEffect(() => {
    if (selectedTemplate?.themes?.[0]) {
      setTheme(selectedTemplate.themes[0].id);
    }
  }, [selectedTemplate]);

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
  
  // Get default values from theme or template
  const defaultColors = {
    overlayBg: currentThemeData?.overlayBg || "rgba(0,0,0,0.5)",
    accentColor: currentThemeData?.accentColor || "#06b6d4",
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
    buttonBg: currentThemeData?.buttonBg || "#1e3a8a"
  };

  // Initialize custom colors with default values
  useEffect(() => {
    setCustomColors(defaultColors);
  }, [theme, selectedTemplate]);

  const handleColorChange = (colorKey, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const handleReset = () => {
    setCustomColors(defaultColors);
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
    if (themeScope === "full-page") {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, themeScope]);

  const isOverlayDesign = themeScope === "full-page";

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* First Column - Customization Panel */}
      <div style={{ width: '30%', backgroundColor: '#f3f4f6', overflow: 'auto', padding: '20px' }}>
        <div className="sticky top-0 bg-gray-100 pb-4 z-10">
          <h1 className="text-2xl text-gray-800 font-bold mb-2">Customize Your Template</h1>
          <button 
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Reset to Default
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Color Customization Sections */}
          {isOverlayDesign ? (
            // Template 2 Customization
            <>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Theme Colors</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                    <input 
                      type="color" 
                      value={accentColor}
                      onChange={(e) => handleColorChange('accentColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overlay Background</label>
                    <input 
                      type="color" 
                      value={overlayBg}
                      onChange={(e) => handleColorChange('overlayBg', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                    <input 
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={parseFloat(overlayBg.match(/[\d.]+/g)?.[0] || 0.5)}
                      onChange={(e) => {
                        const opacity = e.target.value;
                        const rgb = overlayBg.match(/\d+/g);
                        if (rgb) {
                          handleColorChange('overlayBg', `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`);
                        }
                      }}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Template 1 Customization
            <>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Brand Colors</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                    <input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Background</label>
                    <input 
                      type="color" 
                      value={buttonBg}
                      onChange={(e) => handleColorChange('buttonBg', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                    <input 
                      type="color" 
                      value={textColor}
                      onChange={(e) => handleColorChange('textColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description Color</label>
                    <input 
                      type="color" 
                      value={descriptionColor}
                      onChange={(e) => handleColorChange('descriptionColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Card Styles</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Background</label>
                    <input 
                      type="color" 
                      value={cardBg}
                      onChange={(e) => handleColorChange('cardBg', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Border</label>
                    <input 
                      type="color" 
                      value={cardBorder}
                      onChange={(e) => handleColorChange('cardBorder', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Header & Footer</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Header Background</label>
                    <input 
                      type="color" 
                      value={headerBg}
                      onChange={(e) => handleColorChange('headerBg', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Footer Background</label>
                    <input 
                      type="color" 
                      value={footerBg}
                      onChange={(e) => handleColorChange('footerBg', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo Color</label>
                    <input 
                      type="color" 
                      value={logoColor}
                      onChange={(e) => handleColorChange('logoColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Menu Color</label>
                    <input 
                      type="color" 
                      value={menuColor}
                      onChange={(e) => handleColorChange('menuColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Menu Hover Color</label>
                    <input 
                      type="color" 
                      value={menuHoverColor}
                      onChange={(e) => handleColorChange('menuHoverColor', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Second Column - Template Preview */}
      <div style={{ 
        width: '70%', 
        overflow: 'auto', 
        position: 'relative',
        isolation: 'isolate'
      }}>
        <style>
          {`
            .second-column-preview [class*="fixed"],
            .second-column-preview [class*="top-0"],
            .second-column-preview [class*="left-0"],
            .second-column-preview nav {
              position: sticky !important;
              top: 0 !important;
              left: auto !important;
              right: auto !important;
              width: 100% !important;
            }
            
            .second-column-preview {
              isolation: isolate;
            }
          `}
        </style>
        
        <div className={`second-column-preview min-h-screen flex flex-col ${!isOverlayDesign ? 'bg-white' : ''}`}>
          
          {/* Background for Template 2 */}
          {isOverlayDesign && (
            <>
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundImage: `url(${selectedTemplate.home?.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  zIndex: 0,
                  pointerEvents: 'none'
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: overlayBg,
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
            </>
          )}

          <div style={{ position: 'relative', zIndex: 2 }}>
            <Navbar 
              navData={selectedTemplate.navigation || []}
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
              isOverlayDesign={isOverlayDesign}
              accentColor={accentColor}
            />
          </div>
          
          <main className={`flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 ${
            isOverlayDesign ? 'relative z-20 max-w-7xl pt-24' : 'max-w-6xl pt-28'
          }`}>
            <div key={activeTab} className="w-full">
              {activeTab === 'Home' && (
                <Home 
                  data={selectedTemplate.home}
                  styles={selectedTemplate.styles?.home}
                  isOverlayDesign={isOverlayDesign}
                  accentColor={accentColor}
                  primaryColor={primaryColor}
                  descriptionColor={descriptionColor}
                  buttonBg={buttonBg}
                />
              )}
              {activeTab === 'About Us' && (
                <About 
                  data={selectedTemplate.about}
                  styles={selectedTemplate.styles?.about}
                  isOverlayDesign={isOverlayDesign}
                  accentColor={accentColor}
                  primaryColor={primaryColor}
                  textColor={textColor}
                  cardBg={cardBg}
                  cardBorder={cardBorder}
                />
              )}
              {activeTab === 'Courses' && (
                <Courses 
                  data={selectedTemplate.courses}
                  styles={selectedTemplate.styles?.courses}
                  isOverlayDesign={isOverlayDesign}
                  accentColor={accentColor}
                  primaryColor={primaryColor}
                  textColor={textColor}
                  cardBg={cardBg}
                  cardBorder={cardBorder}
                />
              )}
              {activeTab === 'Achievements' && (
                <Achievements 
                  data={selectedTemplate.achievements}
                  styles={selectedTemplate.styles?.achievements}
                  isOverlayDesign={isOverlayDesign}
                  accentColor={accentColor}
                  primaryColor={primaryColor}
                  textColor={textColor}
                  cardBg={cardBg}
                  cardBorder={cardBorder}
                />
              )}
              {activeTab === 'Contact' && (
                <Contact 
                  data={selectedTemplate.contact}
                  styles={selectedTemplate.styles?.contact}
                  isOverlayDesign={isOverlayDesign}
                  accentColor={accentColor}
                  primaryColor={primaryColor}
                  textColor={textColor}
                  cardBg={cardBg}
                  cardBorder={cardBorder}
                />
              )}
            </div>
          </main>

          <footer 
            className="w-full py-6 mt-auto transition-all duration-300"
            style={{ 
              backgroundColor: isOverlayDesign ? 'rgba(0,0,0,0.8)' : footerBg,
              borderTop: isOverlayDesign ? '1px solid rgba(255,255,255,0.1)' : 'none',
              position: 'relative',
              zIndex: 2
            }}
          >
            <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs tracking-wide ${
              isOverlayDesign ? 'text-white/40' : 'text-white/70'
            }`}>
              © {new Date().getFullYear()} Horizon Institute. All content pulled dynamically via JSON.
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}