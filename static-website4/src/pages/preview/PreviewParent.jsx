import { useState, useEffect } from 'react';
import siteData from '../../data/multisiteData.json';
import Navbar from '../../components/Navbar';
import Home from './Home';
import About from './About';
import Courses from './Courses';
import Achievements from './Achievements';
import Contact from './Contact';
import "../../assets/css/PreviewTemplate.css";
import { useLocation } from "react-router-dom";

export default function PreviewParent() {
  const [activeTab, setActiveTab] = useState('Home');
  const [theme, setTheme] = useState('classic');
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
  
  // For Template 2 (full-page theme)
  const overlayBg = currentThemeData?.overlayBg || "rgba(0,0,0,0.5)";
  const accentColor = currentThemeData?.accentColor || "#06b6d4";
  
  // For Template 1 (header-footer theme with body colors)
  const headerBg = currentThemeData?.headerBg || (selectedTemplate.styles?.navbar?.background || "#16275B");
  const footerBg = currentThemeData?.footerBg || headerBg;
  const logoColor = currentThemeData?.logoColor || "#FFFFFF";
  const menuColor = currentThemeData?.menuColor || "#FFFFFF";
  const menuHoverColor = currentThemeData?.menuHoverColor || "#38BDF8";
  
  // Template 1 body theme colors
  const primaryColor = currentThemeData?.primaryColor || "#1e3a8a";
  const secondaryColor = currentThemeData?.secondaryColor || "#3b82f6";
  const textColor = currentThemeData?.textColor || "#1f2937";
  const descriptionColor = currentThemeData?.descriptionColor || "#4b5563";
  const cardBg = currentThemeData?.cardBg || "#ffffff";
  const cardBorder = currentThemeData?.cardBorder || "#e2e8f0";
  const buttonBg = currentThemeData?.buttonBg || "#1e3a8a";

  useEffect(() => {
    if (themeScope === "full-page") {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, themeScope]);

  const isOverlayDesign = themeScope === "full-page";

  return (
    <div className={`min-h-screen flex flex-col ${!isOverlayDesign ? 'bg-white' : ''}`}>
      
      {/* Background for Template 2 */}
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
          borderTop: isOverlayDesign ? '1px solid rgba(255,255,255,0.1)' : 'none'
        }}
      >
        <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs tracking-wide ${
          isOverlayDesign ? 'text-white/40' : 'text-white/70'
        }`}>
          © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}