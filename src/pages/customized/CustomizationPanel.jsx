// src/components/CustomizationPanel.jsx
import { useState, useEffect } from 'react';
import ColorPickerRow from './ColorPickerRow';
import "../../assets/css/CustomizationPanel.css";

const CustomizationPanel = ({ 
  isOverlayDesign, 
  customColors, 
  onColorChange, 
  onReset,
  templateData,
  onTextChange
}) => {
  const [activeMainTab, setActiveMainTab] = useState('colors');
  const [activeColorSubTab, setActiveColorSubTab] = useState('theme');
  const [activeTemplate1SubTab, setActiveTemplate1SubTab] = useState('brand');
  
  // Local state for text content
  const [textContent, setTextContent] = useState({
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

  useEffect(() => {
    if (templateData) {
      setTextContent({
        homeTagline: templateData.home?.tagline || '',
        homeDescription: templateData.home?.description || '',
        homeSubtitle: templateData.home?.subtitle || '',
        homePrimaryCta: templateData.home?.primaryCta || templateData.home?.cta || '',
        aboutTitle: templateData.about?.title || '',
        aboutVision: templateData.about?.sections?.['Our Vision'] || '',
        aboutLeadership: templateData.about?.sections?.['Leadership'] || '',
        aboutHistory: templateData.about?.sections?.['History'] || '',
        aboutCampusLife: templateData.about?.sections?.['Campus Life'] || '',
        coursesTitle: templateData.courses?.title || '',
        coursesEngineering: templateData.courses?.details?.['Engineering'] || '',
        coursesManagement: templateData.courses?.details?.['Management'] || '',
        coursesDataScience: templateData.courses?.details?.['Data Science'] || '',
        coursesDesign: templateData.courses?.details?.['Design'] || '',
        achievementsTitle: templateData.achievements?.title || '',
        achievementsList: templateData.achievements?.list || [],
        contactTitle: templateData.contact?.title || '',
        contactAddress: templateData.contact?.address || '',
        contactPhone: templateData.contact?.phone || '',
        contactEmail: templateData.contact?.email || '',
        navigationItems: templateData.navigation || []
      });
    }
  }, [templateData]);

  const handleTextChange = (field, value) => {
    setTextContent(prev => ({ ...prev, [field]: value }));
    if (onTextChange) {
      onTextChange(field, value);
    }
  };

  const handleAchievementChange = (index, value) => {
    const updatedList = [...textContent.achievementsList];
    updatedList[index] = value;
    setTextContent(prev => ({ ...prev, achievementsList: updatedList }));
    if (onTextChange) {
      onTextChange('achievementsList', updatedList);
    }
  };

  const handleNavigationChange = (index, value) => {
    const updatedNav = [...textContent.navigationItems];
    updatedNav[index] = { ...updatedNav[index], label: value };
    setTextContent(prev => ({ ...prev, navigationItems: updatedNav }));
    if (onTextChange) {
      onTextChange('navigationItems', updatedNav);
    }
  };

  const handleDropdownItemsChange = (navIndex, menuItemIndex, value) => {
    const updatedNav = [...textContent.navigationItems];
    if (updatedNav[navIndex].menuItems) {
      updatedNav[navIndex].menuItems[menuItemIndex] = value;
      setTextContent(prev => ({ ...prev, navigationItems: updatedNav }));
      if (onTextChange) {
        onTextChange('navigationItems', updatedNav);
      }
    }
  };

  const getRGBFromColor = (color) => {
    if (!color) return { r: 0, g: 0, b: 0 };
    if (color.startsWith('rgba')) {
      const match = color.match(/\d+/g);
      if (match) {
        return { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
      }
    } else if (color.startsWith('#')) {
      const hex = color.substring(1);
      if (hex.length === 6) {
        return {
          r: parseInt(hex.substring(0, 2), 16),
          g: parseInt(hex.substring(2, 4), 16),
          b: parseInt(hex.substring(4, 6), 16)
        };
      } else if (hex.length === 3) {
        return {
          r: parseInt(hex.charAt(0) + hex.charAt(0), 16),
          g: parseInt(hex.charAt(1) + hex.charAt(1), 16),
          b: parseInt(hex.charAt(2) + hex.charAt(2), 16)
        };
      }
    } else if (color.startsWith('rgb')) {
      const match = color.match(/\d+/g);
      if (match) {
        return { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
      }
    }
    return { r: 0, g: 0, b: 0 };
  };

  const getOpacityFromColor = (color) => {
    if (!color) return 0.5;
    if (color.startsWith('rgba')) {
      const match = color.match(/[\d.]+(?=\))/);
      if (match && match[0]) {
        return parseFloat(match[0]);
      }
      const parts = color.match(/[\d.]+/g);
      if (parts && parts.length === 4) {
        return parseFloat(parts[3]);
      }
    }
    return 0.5;
  };

  const rgbaToHex = (color) => {
    const { r, g, b } = getRGBFromColor(color);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
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
    onColorChange('overlayBg', `rgba(${r},${g},${b},${newOpacity})`);
  };

  const handleOverlayColorChange = (hex) => {
    const opacity = getOpacityFromColor(customColors.overlayBg);
    const { r, g, b } = getRGBFromColor(hex);
    onColorChange('overlayBg', `rgba(${r},${g},${b},${opacity})`);
  };

  return (
    <div className="customization-panel">
      <div className="panel-header">
        <h1 className="panel-title">🎨 Customize Your Template</h1>
        <button onClick={onReset} className="reset-button">
          🔄 Reset All to Default
        </button>

        <div className="main-tabs">
          <button 
            onClick={() => setActiveMainTab('colors')} 
            className={`main-tab ${activeMainTab === 'colors' ? 'main-tab-active' : 'main-tab-inactive'}`}
          >
            🎨 Colors
          </button>
          <button 
            onClick={() => setActiveMainTab('text')} 
            className={`main-tab ${activeMainTab === 'text' ? 'main-tab-active' : 'main-tab-inactive'}`}
          >
            ✏️ Text Content
          </button>
        </div>
      </div>

      {activeMainTab === 'colors' && (
        <div className="mt-20">
          {/* Global Text Color Section */}
          <div className="section">
            <h3 className="section-title">📝 Global Text Color</h3>
            <ColorPickerRow
              label="Text Color"
              color={customColors.textColor || '#1f2937'}
              onChange={(e) => onColorChange('textColor', e.target.value)}
              description="Main text color across the website (recommended: dark gray/black)"
            />
            <div className="sample-text" style={{ color: customColors.textColor || '#1f2937' }}>
              ⚡ Sample Text: This is how your text will appear
            </div>
          </div>

          {isOverlayDesign ? (
            <>
              <div className="sub-tabs">
                <button 
                  onClick={() => setActiveColorSubTab('theme')} 
                  className={`sub-tab ${activeColorSubTab === 'theme' ? 'sub-tab-active' : 'sub-tab-inactive'}`}
                >
                  🎨 Theme Colors
                </button>
                <button 
                  onClick={() => setActiveColorSubTab('cards')} 
                  className={`sub-tab ${activeColorSubTab === 'cards' ? 'sub-tab-active' : 'sub-tab-inactive'}`}
                >
                  🃏 Card Styles
                </button>
                <button 
                  onClick={() => setActiveColorSubTab('navigation')} 
                  className={`sub-tab ${activeColorSubTab === 'navigation' ? 'sub-tab-active' : 'sub-tab-inactive'}`}
                >
                  🧭 Navigation
                </button>
              </div>

              {activeColorSubTab === 'theme' && (
                <div className="section">
                  <h3 className="section-title">🎨 Theme Colors</h3>
                  <ColorPickerRow
                    label="Accent Color"
                    color={customColors.accentColor}
                    onChange={(e) => onColorChange('accentColor', e.target.value)}
                  />
                  <div className="overlay-color-section">
                    <label className="color-picker-label">
                      Overlay Color
                      <span 
                        className="color-swatch"
                        style={{ backgroundColor: rgbaToHex(customColors.overlayBg) }}
                      ></span>
                    </label>
                    <div className="overlay-input-group">
                      <input 
                        type="color" 
                        value={rgbaToHex(customColors.overlayBg)} 
                        onChange={(e) => handleOverlayColorChange(e.target.value)} 
                        className="color-picker"
                      />
                      <span className="color-value">{customColors.overlayBg}</span>
                    </div>
                    <label className="opacity-label">Overlay Opacity: {Math.round(opacityValue * 100)}%</label>
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
                    onChange={(e) => onColorChange('buttonBg', e.target.value)}
                  />
                </div>
              )}

              {activeColorSubTab === 'cards' && (
                <div className="section">
                  <h3 className="section-title">🃏 Card Styles</h3>
                  <ColorPickerRow label="Card Background" color={customColors.cardBg} onChange={(e) => onColorChange('cardBg', e.target.value)} />
                  <ColorPickerRow label="Card Border" color={customColors.cardBorder} onChange={(e) => onColorChange('cardBorder', e.target.value)} />
                  <ColorPickerRow label="Description Color" color={customColors.descriptionColor} onChange={(e) => onColorChange('descriptionColor', e.target.value)} />
                </div>
              )}

              {activeColorSubTab === 'navigation' && (
                <div className="section">
                  <h3 className="section-title">🧭 Navigation & Header</h3>
                  <ColorPickerRow label="Logo Color" color={customColors.logoColor} onChange={(e) => onColorChange('logoColor', e.target.value)} />
                  <ColorPickerRow label="Menu Color" color={customColors.menuColor} onChange={(e) => onColorChange('menuColor', e.target.value)} />
                  <ColorPickerRow label="Menu Hover Color" color={customColors.menuHoverColor} onChange={(e) => onColorChange('menuHoverColor', e.target.value)} />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="sub-tabs">
                <button 
                  onClick={() => setActiveTemplate1SubTab('brand')} 
                  className={`sub-tab ${activeTemplate1SubTab === 'brand' ? 'sub-tab-active' : 'sub-tab-inactive'}`}
                >
                  🎨 Brand Colors
                </button>
                <button 
                  onClick={() => setActiveTemplate1SubTab('cards')} 
                  className={`sub-tab ${activeTemplate1SubTab === 'cards' ? 'sub-tab-active' : 'sub-tab-inactive'}`}
                >
                  🃏 Card Styles
                </button>
                <button 
                  onClick={() => setActiveTemplate1SubTab('header')} 
                  className={`sub-tab ${activeTemplate1SubTab === 'header' ? 'sub-tab-active' : 'sub-tab-inactive'}`}
                >
                  📋 Header & Footer
                </button>
              </div>

              {activeTemplate1SubTab === 'brand' && (
                <div className="section">
                  <h3 className="section-title">🎨 Brand Colors</h3>
                  <ColorPickerRow label="Primary Color" color={customColors.primaryColor} onChange={(e) => onColorChange('primaryColor', e.target.value)} />
                  <ColorPickerRow label="Button Background" color={customColors.buttonBg} onChange={(e) => onColorChange('buttonBg', e.target.value)} />
                  <ColorPickerRow label="Description Color" color={customColors.descriptionColor} onChange={(e) => onColorChange('descriptionColor', e.target.value)} />
                </div>
              )}

              {activeTemplate1SubTab === 'cards' && (
                <div className="section">
                  <h3 className="section-title">🃏 Card Styles</h3>
                  <ColorPickerRow label="Card Background" color={customColors.cardBg} onChange={(e) => onColorChange('cardBg', e.target.value)} />
                  <ColorPickerRow label="Card Border" color={customColors.cardBorder} onChange={(e) => onColorChange('cardBorder', e.target.value)} />
                </div>
              )}

              {activeTemplate1SubTab === 'header' && (
                <div className="section">
                  <h3 className="section-title">📋 Header & Footer</h3>
                  <ColorPickerRow label="Header Background" color={customColors.headerBg} onChange={(e) => onColorChange('headerBg', e.target.value)} />
                  <ColorPickerRow label="Footer Background" color={customColors.footerBg} onChange={(e) => onColorChange('footerBg', e.target.value)} />
                  <ColorPickerRow label="Logo Color" color={customColors.logoColor} onChange={(e) => onColorChange('logoColor', e.target.value)} />
                  <ColorPickerRow label="Menu Color" color={customColors.menuColor} onChange={(e) => onColorChange('menuColor', e.target.value)} />
                  <ColorPickerRow label="Menu Hover Color" color={customColors.menuHoverColor} onChange={(e) => onColorChange('menuHoverColor', e.target.value)} />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeMainTab === 'text' && (
        <div className="content-container">
          {/* Navigation Labels */}
          <div className="section">
            <h3 className="section-title">📌 Navigation Menu Labels & Dropdown Items</h3>
            {textContent.navigationItems.map((item, index) => (
              <div key={index} className="nav-item">
                <label className="nav-item-label">{item.name}</label>
                <input 
                  type="text" 
                  value={item.label} 
                  onChange={(e) => handleNavigationChange(index, e.target.value)} 
                  className="input-field" 
                  placeholder="Menu Label" 
                />
                {item.menuItems && item.menuItems.length > 0 && (
                  <div className="dropdown-container">
                    <label className="dropdown-header">
                      ▼ Dropdown Items for "{item.label}"
                    </label>
                    {item.menuItems.map((menuItem, menuIndex) => (
                      <div key={menuIndex}>
                        <label className="dropdown-label">Item {menuIndex + 1}</label>
                        <input 
                          type="text" 
                          value={menuItem} 
                          onChange={(e) => handleDropdownItemsChange(index, menuIndex, e.target.value)} 
                          className="input-field" 
                          style={{ fontSize: '12px', marginTop: '2px' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Home Section */}
          <div className="section">
            <h3 className="section-title">🏠 Home Section</h3>
            <div className="form-group">
              <label className="form-label">Tagline / Title</label>
              <input type="text" value={textContent.homeTagline} onChange={(e) => handleTextChange('homeTagline', e.target.value)} className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea value={textContent.homeDescription} onChange={(e) => handleTextChange('homeDescription', e.target.value)} className="textarea-field" rows="3" />
            </div>
            {!isOverlayDesign && (
              <div className="form-group">
                <label className="form-label">Subtitle</label>
                <input type="text" value={textContent.homeSubtitle} onChange={(e) => handleTextChange('homeSubtitle', e.target.value)} className="input-field" />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Primary CTA Button</label>
              <input type="text" value={textContent.homePrimaryCta} onChange={(e) => handleTextChange('homePrimaryCta', e.target.value)} className="input-field" />
            </div>
          </div>

          {/* About Section */}
          <div className="section">
            <h3 className="section-title">📖 About Section</h3>
            <div className="form-group">
              <label className="form-label">Section Title</label>
              <input type="text" value={textContent.aboutTitle} onChange={(e) => handleTextChange('aboutTitle', e.target.value)} className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Our Vision</label>
              <textarea value={textContent.aboutVision} onChange={(e) => handleTextChange('aboutVision', e.target.value)} className="textarea-field" rows="2" />
            </div>
            <div className="form-group">
              <label className="form-label">Leadership</label>
              <textarea value={textContent.aboutLeadership} onChange={(e) => handleTextChange('aboutLeadership', e.target.value)} className="textarea-field" rows="2" />
            </div>
            <div className="form-group">
              <label className="form-label">History</label>
              <textarea value={textContent.aboutHistory} onChange={(e) => handleTextChange('aboutHistory', e.target.value)} className="textarea-field" rows="2" />
            </div>
            <div className="form-group">
              <label className="form-label">Campus Life</label>
              <textarea value={textContent.aboutCampusLife} onChange={(e) => handleTextChange('aboutCampusLife', e.target.value)} className="textarea-field" rows="2" />
            </div>
          </div>

          {/* Courses Section */}
          <div className="section">
            <h3 className="section-title">🎓 Courses Section</h3>
            <div className="form-group">
              <label className="form-label">Section Title</label>
              <input type="text" value={textContent.coursesTitle} onChange={(e) => handleTextChange('coursesTitle', e.target.value)} className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Engineering</label>
              <textarea value={textContent.coursesEngineering} onChange={(e) => handleTextChange('coursesEngineering', e.target.value)} className="textarea-field" rows="2" />
            </div>
            <div className="form-group">
              <label className="form-label">Management</label>
              <textarea value={textContent.coursesManagement} onChange={(e) => handleTextChange('coursesManagement', e.target.value)} className="textarea-field" rows="2" />
            </div>
            <div className="form-group">
              <label className="form-label">Data Science</label>
              <textarea value={textContent.coursesDataScience} onChange={(e) => handleTextChange('coursesDataScience', e.target.value)} className="textarea-field" rows="2" />
            </div>
            <div className="form-group">
              <label className="form-label">Design</label>
              <textarea value={textContent.coursesDesign} onChange={(e) => handleTextChange('coursesDesign', e.target.value)} className="textarea-field" rows="2" />
            </div>
          </div>

          {/* Achievements Section */}
          <div className="section">
            <h3 className="section-title">🏆 Achievements Section</h3>
            <div className="form-group">
              <label className="form-label">Section Title</label>
              <input type="text" value={textContent.achievementsTitle} onChange={(e) => handleTextChange('achievementsTitle', e.target.value)} className="input-field" />
            </div>
            {textContent.achievementsList.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <label className="achievement-label">Achievement {index + 1}</label>
                <input type="text" value={achievement} onChange={(e) => handleAchievementChange(index, e.target.value)} className="input-field" />
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="section">
            <h3 className="section-title">📞 Contact Section</h3>
            <div className="form-group">
              <label className="form-label">Section Title</label>
              <input type="text" value={textContent.contactTitle} onChange={(e) => handleTextChange('contactTitle', e.target.value)} className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input type="text" value={textContent.contactAddress} onChange={(e) => handleTextChange('contactAddress', e.target.value)} className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" value={textContent.contactPhone} onChange={(e) => handleTextChange('contactPhone', e.target.value)} className="input-field" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" value={textContent.contactEmail} onChange={(e) => handleTextChange('contactEmail', e.target.value)} className="input-field" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationPanel;