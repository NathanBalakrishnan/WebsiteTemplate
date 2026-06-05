import { useState, useEffect } from 'react';

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

  const mainTabStyle = (isActive) => ({
    padding: '10px 20px',
    backgroundColor: isActive ? '#3b82f6' : '#e5e7eb',
    color: isActive ? 'white' : '#374151',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
    flex: 1,
    textAlign: 'center'
  });

  const subTabStyle = (isActive) => ({
    padding: '6px 12px',
    backgroundColor: isActive ? '#6366f1' : '#f3f4f6',
    color: isActive ? 'white' : '#4b5563',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.2s',
    flex: 1,
    textAlign: 'center'
  });

  // Rounded color input style
  const roundedColorInputStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: '3px solid #e5e7eb',
    cursor: 'pointer',
    padding: '0',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  // Full width rounded color input style
  const fullRoundedColorInputStyle = {
    width: '100%',
    height: '50px',
    borderRadius: '25px',
    border: '2px solid #e5e7eb',
    cursor: 'pointer',
    padding: '0 8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    fontSize: '13px',
    fontFamily: 'inherit',
    marginTop: '4px',
    boxSizing: 'border-box',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    transition: 'all 0.2s'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '70px',
    resize: 'vertical'
  };

  const sectionStyle = {
    backgroundColor: 'white',
    padding: '18px',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '20px'
  };

  const sectionTitleStyle = {
    fontWeight: '600',
    fontSize: '16px',
    marginBottom: '16px',
    color: '#1f2937',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const colorSwatchStyle = (color) => ({
    display: 'inline-block',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: color,
    border: '2px solid white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    marginLeft: '8px',
    verticalAlign: 'middle'
  });

  const dropdownContainerStyle = {
    marginLeft: '20px',
    marginTop: '8px',
    marginBottom: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    borderLeft: '3px solid #6366f1'
  };

  const dropdownLabelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '4px',
    marginTop: '8px'
  };

  // Color picker row component for better layout
  const ColorPickerRow = ({ label, color, onChange, description }) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
        {label}
        <span style={colorSwatchStyle(color)}></span>
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input 
          type="color" 
          value={color}
          onChange={onChange}
          style={roundedColorInputStyle}
        />
        <span style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>{color}</span>
      </div>
      {description && <div style={{ marginTop: '4px', fontSize: '11px', color: '#9ca3af' }}>{description}</div>}
    </div>
  );

  return (
    <div style={{
      width: '30%',
      minWidth: '340px',
      height: '100vh',
      backgroundColor: '#f3f4f6',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '20px',
      boxSizing: 'border-box',
      flexShrink: 0,
      position: 'relative',
      zIndex: 200,
    }}>
      <div style={{ position: 'sticky', top: 0, backgroundColor: '#f3f4f6', paddingBottom: '12px', zIndex: 10 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>🎨 Customize Your Template</h1>
        <button
          onClick={onReset}
          style={{
            padding: '10px 16px',
            backgroundColor: '#4b5563',
            color: 'white',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'background-color 0.2s',
            width: '100%',
            marginBottom: '16px'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4b5563'}
        >
          🔄 Reset All to Default
        </button>

        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button onClick={() => setActiveMainTab('colors')} style={mainTabStyle(activeMainTab === 'colors')}>
            🎨 Colors
          </button>
          <button onClick={() => setActiveMainTab('text')} style={mainTabStyle(activeMainTab === 'text')}>
            ✏️ Text Content
          </button>
        </div>
      </div>

      {activeMainTab === 'colors' && (
        <div style={{ marginTop: '20px' }}>
          {/* Global Text Color Section */}
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>📝 Global Text Color</h3>
            <ColorPickerRow
              label="Text Color"
              color={customColors.textColor || '#1f2937'}
              onChange={(e) => onColorChange('textColor', e.target.value)}
              description="Main text color across the website (recommended: dark gray/black)"
            />
            <div style={{ marginTop: '12px', padding: '12px', borderRadius: '12px', backgroundColor: '#f3f4f6', color: customColors.textColor || '#1f2937', fontSize: '13px', textAlign: 'center' }}>
              ⚡ Sample Text: This is how your text will appear
            </div>
          </div>

          {isOverlayDesign ? (
            <>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <button onClick={() => setActiveColorSubTab('theme')} style={subTabStyle(activeColorSubTab === 'theme')}>🎨 Theme Colors</button>
                <button onClick={() => setActiveColorSubTab('cards')} style={subTabStyle(activeColorSubTab === 'cards')}>🃏 Card Styles</button>
                <button onClick={() => setActiveColorSubTab('navigation')} style={subTabStyle(activeColorSubTab === 'navigation')}>🧭 Navigation</button>
              </div>

              {activeColorSubTab === 'theme' && (
                <div style={sectionStyle}>
                  <h3 style={sectionTitleStyle}>🎨 Theme Colors</h3>
                  <ColorPickerRow
                    label="Accent Color"
                    color={customColors.accentColor}
                    onChange={(e) => onColorChange('accentColor', e.target.value)}
                  />
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                      Overlay Color
                      <span style={colorSwatchStyle(rgbaToHex(customColors.overlayBg))}></span>
                    </label>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                      <input type="color" value={rgbaToHex(customColors.overlayBg)} onChange={(e) => handleOverlayColorChange(e.target.value)} style={roundedColorInputStyle} />
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{customColors.overlayBg}</span>
                    </div>
                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Overlay Opacity: {Math.round(opacityValue * 100)}%</label>
                    <input type="range" min="0" max="1" step="0.01" value={opacityValue} onChange={handleOpacityChange} style={{ width: '100%', marginTop: '8px', cursor: 'pointer' }} />
                  </div>
                  <ColorPickerRow
                    label="Button Background"
                    color={customColors.buttonBg}
                    onChange={(e) => onColorChange('buttonBg', e.target.value)}
                  />
                </div>
              )}

              {activeColorSubTab === 'cards' && (
                <div style={sectionStyle}>
                  <h3 style={sectionTitleStyle}>🃏 Card Styles</h3>
                  <ColorPickerRow label="Card Background" color={customColors.cardBg} onChange={(e) => onColorChange('cardBg', e.target.value)} />
                  <ColorPickerRow label="Card Border" color={customColors.cardBorder} onChange={(e) => onColorChange('cardBorder', e.target.value)} />
                  <ColorPickerRow label="Description Color" color={customColors.descriptionColor} onChange={(e) => onColorChange('descriptionColor', e.target.value)} />
                </div>
              )}

              {activeColorSubTab === 'navigation' && (
                <div style={sectionStyle}>
                  <h3 style={sectionTitleStyle}>🧭 Navigation & Header</h3>
                  <ColorPickerRow label="Logo Color" color={customColors.logoColor} onChange={(e) => onColorChange('logoColor', e.target.value)} />
                  <ColorPickerRow label="Menu Color" color={customColors.menuColor} onChange={(e) => onColorChange('menuColor', e.target.value)} />
                  <ColorPickerRow label="Menu Hover Color" color={customColors.menuHoverColor} onChange={(e) => onColorChange('menuHoverColor', e.target.value)} />
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <button onClick={() => setActiveTemplate1SubTab('brand')} style={subTabStyle(activeTemplate1SubTab === 'brand')}>🎨 Brand Colors</button>
                <button onClick={() => setActiveTemplate1SubTab('cards')} style={subTabStyle(activeTemplate1SubTab === 'cards')}>🃏 Card Styles</button>
                <button onClick={() => setActiveTemplate1SubTab('header')} style={subTabStyle(activeTemplate1SubTab === 'header')}>📋 Header & Footer</button>
              </div>

              {activeTemplate1SubTab === 'brand' && (
                <div style={sectionStyle}>
                  <h3 style={sectionTitleStyle}>🎨 Brand Colors</h3>
                  <ColorPickerRow label="Primary Color" color={customColors.primaryColor} onChange={(e) => onColorChange('primaryColor', e.target.value)} />
                  <ColorPickerRow label="Button Background" color={customColors.buttonBg} onChange={(e) => onColorChange('buttonBg', e.target.value)} />
                  <ColorPickerRow label="Description Color" color={customColors.descriptionColor} onChange={(e) => onColorChange('descriptionColor', e.target.value)} />
                </div>
              )}

              {activeTemplate1SubTab === 'cards' && (
                <div style={sectionStyle}>
                  <h3 style={sectionTitleStyle}>🃏 Card Styles</h3>
                  <ColorPickerRow label="Card Background" color={customColors.cardBg} onChange={(e) => onColorChange('cardBg', e.target.value)} />
                  <ColorPickerRow label="Card Border" color={customColors.cardBorder} onChange={(e) => onColorChange('cardBorder', e.target.value)} />
                </div>
              )}

              {activeTemplate1SubTab === 'header' && (
                <div style={sectionStyle}>
                  <h3 style={sectionTitleStyle}>📋 Header & Footer</h3>
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
        <div style={{ marginTop: '20px', paddingBottom: '20px' }}>
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>📌 Navigation Menu Labels & Dropdown Items</h3>
            {textContent.navigationItems.map((item, index) => (
              <div key={index} style={{ marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#6b7280' }}>{item.name}</label>
                <input type="text" value={item.label} onChange={(e) => handleNavigationChange(index, e.target.value)} style={inputStyle} placeholder="Menu Label" />
                {item.menuItems && item.menuItems.length > 0 && (
                  <div style={dropdownContainerStyle}>
                    <label style={{ fontSize: '11px', fontWeight: '600', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
                      ▼ Dropdown Items for "{item.label}"
                    </label>
                    {item.menuItems.map((menuItem, menuIndex) => (
                      <div key={menuIndex} style={{ marginBottom: '8px' }}>
                        <label style={dropdownLabelStyle}>Item {menuIndex + 1}</label>
                        <input type="text" value={menuItem} onChange={(e) => handleDropdownItemsChange(index, menuIndex, e.target.value)} style={{ ...inputStyle, fontSize: '12px', marginTop: '2px' }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>🏠 Home Section</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Tagline / Title</label>
              <input type="text" value={textContent.homeTagline} onChange={(e) => handleTextChange('homeTagline', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Description</label>
              <textarea value={textContent.homeDescription} onChange={(e) => handleTextChange('homeDescription', e.target.value)} style={textareaStyle} rows="3" />
            </div>
            {!isOverlayDesign && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500' }}>Subtitle</label>
                <input type="text" value={textContent.homeSubtitle} onChange={(e) => handleTextChange('homeSubtitle', e.target.value)} style={inputStyle} />
              </div>
            )}
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Primary CTA Button</label>
              <input type="text" value={textContent.homePrimaryCta} onChange={(e) => handleTextChange('homePrimaryCta', e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>📖 About Section</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Section Title</label>
              <input type="text" value={textContent.aboutTitle} onChange={(e) => handleTextChange('aboutTitle', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Our Vision</label>
              <textarea value={textContent.aboutVision} onChange={(e) => handleTextChange('aboutVision', e.target.value)} style={textareaStyle} rows="2" />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Leadership</label>
              <textarea value={textContent.aboutLeadership} onChange={(e) => handleTextChange('aboutLeadership', e.target.value)} style={textareaStyle} rows="2" />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>History</label>
              <textarea value={textContent.aboutHistory} onChange={(e) => handleTextChange('aboutHistory', e.target.value)} style={textareaStyle} rows="2" />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Campus Life</label>
              <textarea value={textContent.aboutCampusLife} onChange={(e) => handleTextChange('aboutCampusLife', e.target.value)} style={textareaStyle} rows="2" />
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>🎓 Courses Section</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Section Title</label>
              <input type="text" value={textContent.coursesTitle} onChange={(e) => handleTextChange('coursesTitle', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Engineering</label>
              <textarea value={textContent.coursesEngineering} onChange={(e) => handleTextChange('coursesEngineering', e.target.value)} style={textareaStyle} rows="2" />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Management</label>
              <textarea value={textContent.coursesManagement} onChange={(e) => handleTextChange('coursesManagement', e.target.value)} style={textareaStyle} rows="2" />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Data Science</label>
              <textarea value={textContent.coursesDataScience} onChange={(e) => handleTextChange('coursesDataScience', e.target.value)} style={textareaStyle} rows="2" />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Design</label>
              <textarea value={textContent.coursesDesign} onChange={(e) => handleTextChange('coursesDesign', e.target.value)} style={textareaStyle} rows="2" />
            </div>
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>🏆 Achievements Section</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Section Title</label>
              <input type="text" value={textContent.achievementsTitle} onChange={(e) => handleTextChange('achievementsTitle', e.target.value)} style={inputStyle} />
            </div>
            {textContent.achievementsList.map((achievement, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '11px', color: '#6b7280' }}>Achievement {index + 1}</label>
                <input type="text" value={achievement} onChange={(e) => handleAchievementChange(index, e.target.value)} style={inputStyle} />
              </div>
            ))}
          </div>

          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>📞 Contact Section</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Section Title</label>
              <input type="text" value={textContent.contactTitle} onChange={(e) => handleTextChange('contactTitle', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Address</label>
              <input type="text" value={textContent.contactAddress} onChange={(e) => handleTextChange('contactAddress', e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Phone</label>
              <input type="text" value={textContent.contactPhone} onChange={(e) => handleTextChange('contactPhone', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Email</label>
              <input type="email" value={textContent.contactEmail} onChange={(e) => handleTextChange('contactEmail', e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationPanel;