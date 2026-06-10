export default function Contact({ data, styles, isOverlayDesign = false, accentColor, primaryColor, textColor, cardBg, cardBorder }) {
  if (isOverlayDesign) {
    // Template 2 style - Dark overlay with theme colors
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center">
        <h1 
          className="text-4xl font-bold mb-8"
          style={{ color: accentColor || "#06b6d4" }}
        >
          {data.title}
        </h1>
        <div 
          className="p-8 rounded-2xl space-y-6 backdrop-blur-sm border transition-all duration-300"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: `${accentColor || "#06b6d4"}40`,
          }}
        >
          <div>
            <h3 
              className="text-sm uppercase tracking-wider mb-1"
              style={{ color: accentColor || "#06b6d4" }}
            >
              Address
            </h3>
            <p className="text-white/80">{data.address}</p>
          </div>
          <div>
            <h3 
              className="text-sm uppercase tracking-wider mb-1"
              style={{ color: accentColor || "#06b6d4" }}
            >
              Phone
            </h3>
            <p className="text-white/80">{data.phone}</p>
          </div>
          <div>
            <h3 
              className="text-sm uppercase tracking-wider mb-1"
              style={{ color: accentColor || "#06b6d4" }}
            >
              Email
            </h3>
            <p 
              className="hover:underline cursor-pointer transition-colors"
              style={{ color: accentColor || "#06b6d4" }}
            >
              {data.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Template 1 style - Colors change with theme
  return (
    <div className="max-w-md mx-auto py-12 px-4 text-center">
      <h1 
        className="text-4xl font-bold mb-8"
        style={{ color: primaryColor || styles?.titleColor || '#1e3a8a' }}
      >
        {data.title}
      </h1>
      <div 
        className="p-8 rounded-2xl shadow-md space-y-6 border transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: cardBg || styles?.cardBackground || '#ffffff',
          borderColor: cardBorder || styles?.cardBorder || '#e2e8f0',
        }}
      >
        <div>
          <h3 
            className="text-sm uppercase tracking-wider mb-1 font-semibold"
            style={{ color: primaryColor || styles?.titleColor || '#1e3a8a' }}
          >
            Address
          </h3>
          <p style={{ color: textColor || styles?.cardTextColor || '#4b5563' }}>
            {data.address}
          </p>
        </div>
        <div>
          <h3 
            className="text-sm uppercase tracking-wider mb-1 font-semibold"
            style={{ color: primaryColor || styles?.titleColor || '#1e3a8a' }}
          >
            Phone
          </h3>
          <p style={{ color: textColor || styles?.cardTextColor || '#4b5563' }}>
            {data.phone}
          </p>
        </div>
        <div>
          <h3 
            className="text-sm uppercase tracking-wider mb-1 font-semibold"
            style={{ color: primaryColor || styles?.titleColor || '#1e3a8a' }}
          >
            Email
          </h3>
          <p 
            className="hover:underline cursor-pointer transition-colors"
            style={{ color: primaryColor || styles?.titleColor || '#1e3a8a' }}
          >
            {data.email}
          </p>
        </div>
      </div>
    </div>
  );
}