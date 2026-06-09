import * as Icons from 'react-icons/fi';
import * as MdIcons from 'react-icons/md';
import * as AiIcons from 'react-icons/ai';
import * as BsIcons from 'react-icons/bs';

// Merge all icons
const allIcons = {
  ...Icons,
  ...MdIcons,
  ...AiIcons,
  ...BsIcons,
};

const IconRenderer = ({ name, size = 24, color, className, style, onClick }) => {
  // Get the icon component directly from the merged object
  const IconComponent = allIcons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <IconComponent 
      size={size} 
      color={color} 
      className={className} 
      style={style}
      onClick={onClick}
    />
  );
};

export default IconRenderer;