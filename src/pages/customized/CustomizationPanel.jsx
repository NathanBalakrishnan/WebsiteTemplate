// src/components/CustomizationPanel.jsx
import { useState, useEffect } from 'react';

const CustomizationPanel = ({ 
  isOverlayDesign, 
  customColors, 
//   defaultColors, 
  onColorChange, 
  onReset 
}) => {
  // Helper function to get RGB from color (define first)
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

  // Helper function to get opacity from color (define second)
  const getOpacityFromColor = (color) => {
    if (!color) return 0.5;
    if (color.startsWith('rgba')) {
      const match = color.match(/[\d.]+(?=\))/);
      if (match && match[0]) {
        return parseFloat(match[0]);
      }
      // Alternative regex for rgba values
      const parts = color.match(/[\d.]+/g);
      if (parts && parts.length === 4) {
        return parseFloat(parts[3]);
      }
    }
    return 0.5;
  };

  // Helper function to convert rgba to hex for color picker (define third)
  const rgbaToHex = (color) => {
    const { r, g, b } = getRGBFromColor(color);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Local state for opacity to ensure smooth updates
  const [opacityValue, setOpacityValue] = useState(() => {
    return getOpacityFromColor(customColors.overlayBg);
  });

  // Update local opacity when customColors.overlayBg changes
  useEffect(() => {
    const newOpacity = getOpacityFromColor(customColors.overlayBg);
    setOpacityValue(newOpacity);
  }, [customColors.overlayBg, getOpacityFromColor]);

  // Handle opacity change
  const handleOpacityChange = (e) => {
    const newOpacity = parseFloat(e.target.value);
    setOpacityValue(newOpacity);
    const { r, g, b } = getRGBFromColor(customColors.overlayBg);
    onColorChange('overlayBg', `rgba(${r},${g},${b},${newOpacity})`);
  };

  // Handle overlay color change
  const handleOverlayColorChange = (hex) => {
    const opacity = getOpacityFromColor(customColors.overlayBg);
    const { r, g, b } = getRGBFromColor(hex);
    onColorChange('overlayBg', `rgba(${r},${g},${b},${opacity})`);
  };

  return (
    <div style={{
      width: '30%',
      minWidth: '260px',
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Customize Your Template</h1>
        <button
          onClick={onReset}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4b5563',
            color: 'white',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#4b5563'}
        >
          Reset to Default
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {isOverlayDesign ? (
          // Template 2 Customization - Full Overlay Design Panel
          <>
            {/* Theme Colors Section */}
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: '#1f2937' }}>Theme Colors</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Accent Color</label>
                  <input 
                    type="color" 
                    value={customColors.accentColor}
                    onChange={(e) => onColorChange('accentColor', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.accentColor}
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Overlay Color</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <input 
                      type="color" 
                      value={rgbaToHex(customColors.overlayBg)}
                      onChange={(e) => handleOverlayColorChange(e.target.value)}
                      style={{ width: '48px', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#4b5563' }}>Base Color</span>
                  </div>
                  
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Overlay Opacity</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01"
                      value={opacityValue}
                      onChange={handleOpacityChange}
                      style={{ flex: 1, cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#4b5563', width: '48px' }}>
                      {Math.round(opacityValue * 100)}%
                    </span>
                  </div>
                  
                  <div style={{ marginTop: '12px', padding: '8px', borderRadius: '4px', fontSize: '12px', textAlign: 'center', backgroundColor: customColors.overlayBg, color: '#fff' }}>
                    Preview: {customColors.overlayBg}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Button Background</label>
                  <input 
                    type="color" 
                    value={customColors.buttonBg}
                    onChange={(e) => onColorChange('buttonBg', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.buttonBg}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Styles Section for Overlay */}
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: '#1f2937' }}>Card Styles</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Card Background</label>
                  <input 
                    type="color" 
                    value={customColors.cardBg}
                    onChange={(e) => onColorChange('cardBg', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.cardBg}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Card Border</label>
                  <input 
                    type="color" 
                    value={customColors.cardBorder}
                    onChange={(e) => onColorChange('cardBorder', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.cardBorder}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Text Color</label>
                  <input 
                    type="color" 
                    value={customColors.textColor}
                    onChange={(e) => onColorChange('textColor', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.textColor}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Description Color</label>
                  <input 
                    type="color" 
                    value={customColors.descriptionColor}
                    onChange={(e) => onColorChange('descriptionColor', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.descriptionColor}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation & Header Styles for Overlay */}
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: '#1f2937' }}>Navigation & Header</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Logo Color</label>
                  <input 
                    type="color" 
                    value={customColors.logoColor}
                    onChange={(e) => onColorChange('logoColor', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.logoColor}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Menu Color</label>
                  <input 
                    type="color" 
                    value={customColors.menuColor}
                    onChange={(e) => onColorChange('menuColor', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.menuColor}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Menu Hover Color</label>
                  <input 
                    type="color" 
                    value={customColors.menuHoverColor}
                    onChange={(e) => onColorChange('menuHoverColor', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.menuHoverColor}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Template 1 Customization - Full Panel
          <>
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: '#1f2937' }}>Brand Colors</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Primary Color</label>
                  <input 
                    type="color" 
                    value={customColors.primaryColor}
                    onChange={(e) => onColorChange('primaryColor', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.primaryColor}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Button Background</label>
                  <input 
                    type="color" 
                    value={customColors.buttonBg}
                    onChange={(e) => onColorChange('buttonBg', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.buttonBg}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Text Color</label>
                  <input 
                    type="color" 
                    value={customColors.textColor}
                    onChange={(e) => onColorChange('textColor', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.textColor}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Description Color</label>
                  <input 
                    type="color" 
                    value={customColors.descriptionColor}
                    onChange={(e) => onColorChange('descriptionColor', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.descriptionColor}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: '#1f2937' }}>Card Styles</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Card Background</label>
                  <input 
                    type="color" 
                    value={customColors.cardBg}
                    onChange={(e) => onColorChange('cardBg', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.cardBg}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Card Border</label>
                  <input 
                    type="color" 
                    value={customColors.cardBorder}
                    onChange={(e) => onColorChange('cardBorder', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.cardBorder}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '12px', color: '#1f2937' }}>Header & Footer</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Header Background</label>
                  <input 
                    type="color" 
                    value={customColors.headerBg}
                    onChange={(e) => onColorChange('headerBg', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.headerBg}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Footer Background</label>
                  <input 
                    type="color" 
                    value={customColors.footerBg}
                    onChange={(e) => onColorChange('footerBg', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.footerBg}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Logo Color</label>
                  <input 
                    type="color" 
                    value={customColors.logoColor}
                    onChange={(e) => onColorChange('logoColor', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.logoColor}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Menu Color</label>
                  <input 
                    type="color" 
                    value={customColors.menuColor}
                    onChange={(e) => onColorChange('menuColor', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.menuColor}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Menu Hover Color</label>
                  <input 
                    type="color" 
                    value={customColors.menuHoverColor}
                    onChange={(e) => onColorChange('menuHoverColor', e.target.value)}
                    style={{ width: '100%', height: '40px', borderRadius: '4px', border: '1px solid #d1d5db', cursor: 'pointer' }} 
                  />
                  <div style={{ marginTop: '4px', fontSize: '12px', color: '#6b7280' }}>
                    Current: {customColors.menuHoverColor}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomizationPanel;