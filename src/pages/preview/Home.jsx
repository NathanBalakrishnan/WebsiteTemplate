export default function Home({ data, styles, isOverlayDesign = false, accentColor, primaryColor, descriptionColor, buttonBg }) {
  if (isOverlayDesign) {
    // Template 2 design
    return (
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            {data.tagline}
          </h1>
          <p className="text-lg text-gray-300 mb-8">{data.description}</p>
          <div className="flex gap-4 justify-center lg:justify-start">
            {data?.primaryCta && (
              <button
                className="px-8 py-3 rounded-lg hover:opacity-90 transition-all font-medium"
                style={{
                  backgroundColor: accentColor || "#06b6d4",
                  color: "white",
                }}
              >
                {data.primaryCta}
              </button>
            )}
            {data?.secondaryCta && (
              <button className="px-8 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                {data.secondaryCta}
              </button>
            )}
          </div>
        </div>
        <div className="flex-1"
          onMouseEnter={() => console.log("Mouse Enter")}
          onMouseLeave={() => console.log("Mouse Leave")}
        >

          <img src={data.image} alt="Hero" className="
                      w-full
                      rounded-2xl
                      shadow-2xl
                      border-2
                      border-transparent
                      hover:border-white/40
                      hover:scale-105
                      transition-all
                      duration-300
                      hover:rotate-5
                      "
            style={{
              transformOrigin: "center center",
            }}
          />
        </div>
      </div>
    );
  }

  // Template 1 design - colors change with theme
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <h1 
        className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
        style={{ color: primaryColor || styles?.titleColor || '#1e3a8a' }}
      >
        {data.title || data.tagline}
      </h1>
      <p 
        className="text-lg lg:text-xl mb-10 leading-relaxed max-w-2xl mx-auto"
        style={{ color: descriptionColor || styles?.descriptionColor || '#4b5563' }}
      >
        {data.subtitle || data.description}
      </p>
      <button 
        className="px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg transform hover:-translate-y-0.5"
        style={{ 
          backgroundColor: buttonBg || styles?.buttonBg || primaryColor || '#1e3a8a',
          color: styles?.buttonText || 'white'
        }}
      >
        {data.cta || data.primaryCta || "Explore Our Programs"}
      </button>
    </div>
  );
}