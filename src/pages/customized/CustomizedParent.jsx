import { useState, useEffect, useRef } from 'react';
import siteData from '../../data/multisiteData.json';
import Navbar from '../../components/Navbar';
import Home from '../preview/Home';
import About from '../preview/About';
import Courses from '../preview/Courses';
import Achievements from '../preview/Achievements';
import Contact from '../preview/Contact';
import CustomizationPanel from './CustomizationPanel';
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

  // Add text overrides state
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
    navigationItems: []
  });

  const location = useLocation();
  const previewRef = useRef(null);

  const selectedTemplateId = location.state?.templateId;
  const selectedTemplate = siteData.find(
    (template) => template.templateId === selectedTemplateId
  );

  useEffect(() => {
    if (selectedTemplate?.themes?.[0]) {
      setTheme(selectedTemplate.themes[0].id);
    }
    // Reset text overrides when template changes
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
      navigationItems: []
    });
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

  useEffect(() => {
    setCustomColors(defaultColors);
  }, [theme, selectedTemplate]);

  const handleColorChange = (colorKey, value) => {
    setCustomColors(prev => ({ ...prev, [colorKey]: value }));
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
      navigationItems: []
    });
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

  useEffect(() => {
    if (themeScope === "full-page") {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, themeScope]);

  const isOverlayDesign = themeScope === "full-page";

  // Prepare data with text overrides
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
      {/* LEFT COLUMN — Customization Panel Component */}
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

      {/* RIGHT COLUMN — Template Preview */}
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
        {/* Navbar */}
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
            isOverlayDesign={isOverlayDesign}
            accentColor={accentColor}
          />
        </div>

        {/* Scrollable page content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
        }}>
          <div className={`min-h-full flex flex-col ${!isOverlayDesign ? 'bg-white' : ''}`}>
            {/* Background for overlay design */}
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

            <main className={`flex-grow w-full mx-auto px-4 sm:px-6 lg:px-8 ${
              isOverlayDesign ? 'relative z-20 max-w-7xl pt-8' : 'max-w-6xl pt-8'
            }`}>
              <div key={activeTab} className="w-full">
                {activeTab === 'Home' && (
                  <Home
                    data={homeData}
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
                    data={aboutData}
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
                    data={coursesData}
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
                    data={achievementsData}
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
                    data={contactData}
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
                zIndex: 2,
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
    </div>
  );
}