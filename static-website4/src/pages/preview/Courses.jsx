export default function Courses({ data, styles, isOverlayDesign = false, accentColor, primaryColor, textColor, cardBg, cardBorder }) {
  if (isOverlayDesign) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 
          className="text-4xl font-bold mb-8 text-center"
          style={{ color: accentColor || "#06b6d4" }}
        >
          {data.title}
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          {Object.entries(data.details).map(([key, value]) => (
            <div 
              key={key} 
              className="backdrop-blur-sm p-6 rounded-xl border transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: `${accentColor || "#06b6d4"}40`,
              }}
            >
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: accentColor || "#06b6d4" }}
              >
                {key}
              </h3>
              <p className="text-white/70">{value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Template 1 - colors change with theme
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 
        className="text-4xl font-bold mb-8 text-center"
        style={{ color: primaryColor || styles?.titleColor || '#1e3a8a' }}
      >
        {data.title}
      </h1>
      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(data.details).map(([key, value]) => (
          <div 
            key={key} 
            className="p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
            style={{
              background: cardBg || styles?.cardBackground || 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
              border: `1px solid ${cardBorder || styles?.cardBorder || '#e2e8f0'}`,
            }}
          >
            <h3 
              className="text-xl font-bold mb-2"
              style={{ color: primaryColor || styles?.titleColor || '#1e3a8a' }}
            >
              {key}
            </h3>
            <p style={{ color: textColor || styles?.cardTextColor || '#475569' }}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}