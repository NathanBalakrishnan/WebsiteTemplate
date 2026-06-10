// src/components/DynamicIcon.jsx
import React, { memo } from 'react';
import { getIcon } from '../../utils/iconMapper';

const DynamicIcon = memo(({ 
  name, 
  size = 24, 
  color, 
  className, 
  style, 
  onClick,
  ...restProps 
}) => {
  const IconComponent = getIcon(name);
  
  if (!IconComponent) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Icon "${name}" not found`);
    }
    return null;
  }
  
  return (
    <IconComponent 
      size={size} 
      color={color} 
      className={className} 
      style={style}
      onClick={onClick}
      {...restProps}
    />
  );
});

DynamicIcon.displayName = 'DynamicIcon';

export default DynamicIcon;