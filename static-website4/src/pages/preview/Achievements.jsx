export default function Achievements({ data, styles, isOverlayDesign = false, accentColor, primaryColor, textColor, cardBg, cardBorder }) {
  if (isOverlayDesign) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: accentColor || "#06b6d4" }}
        >
          {data.title}
        </h1>
        <div className="space-y-4">
          {data.list.map((item, index) => (
            <div 
              key={index} 
              className="flex items-start p-5 rounded-lg backdrop-blur-sm border-l-4 transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderLeftColor: accentColor || "#06b6d4",
              }}
            >
              <span 
                className="mr-3 font-bold text-lg"
                style={{ color: accentColor || "#06b6d4" }}
              >
                ✓
              </span>
              <p className="text-white/80">{item}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Template 1 - colors change with theme
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 
        className="text-4xl font-bold mb-8 text-center"
        style={{ color: primaryColor || styles?.titleColor || '#1e3a8a' }}
      >
        {data.title}
      </h1>
      <div className="space-y-4">
        {data.list.map((item, index) => (
          <div 
            key={index} 
            className="flex items-start p-5 rounded-lg shadow-sm border-l-4 transition-all duration-300 hover:shadow-md"
            style={{
              backgroundColor: cardBg || styles?.cardBackground || '#ffffff',
              borderLeftColor: primaryColor || styles?.titleColor || '#1e3a8a',
            }}
          >
            <span 
              className="mr-3 font-bold text-lg"
              style={{ color: primaryColor || styles?.titleColor || '#1e3a8a' }}
            >
              ✓
            </span>
            <p style={{ color: textColor || styles?.cardTextColor || '#475569' }}>
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}