// src/components/ColorPickerRow.jsx
import React from 'react';
import '../../assets/css/CustomizationPanel.css';

const ColorPickerRow = ({ label, color, onChange, description }) => (
  <div className="color-picker-row">
    <label className="color-picker-label">
      {label}
      <span 
        className="color-swatch"
        style={{ backgroundColor: color }}
      ></span>
    </label>
    <div className="color-picker-container">
      <input 
        type="color" 
        value={color}
        onChange={onChange}
        className="color-picker"
      />
      <span className="color-value">{color}</span>
    </div>
    {description && <div className="color-description">{description}</div>}
  </div>
);

export default ColorPickerRow;