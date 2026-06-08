// src/pages/HomePage.jsx
import "../assets/css/Welcome.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { loadUserCustomizedTemplate } from "../utils/userTemplateStorage";
import data from "../data/multisiteData.json";

export default function Welcome({ onProtectedAction, isAuthenticated }) {
  const { user } = useSelector((state) => state.auth);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      
      try {
        let availableTemplates = [...data];
        
        if (user && isAuthenticated) {
          // Check if user has templates array, if not, use empty array
          const userTemplateIds = user.templates || [];
          
          console.log('User:', user);
          console.log('User template IDs:', userTemplateIds);
          
          // Filter templates based on user's templates array
          availableTemplates = data.filter(template => 
            userTemplateIds.includes(template.templateId)
          );
          
          console.log('Available templates after filter:', availableTemplates);
          
          // Load user-specific customized templates
          const loadedTemplates = availableTemplates.map(template => {
            const userTemplate = loadUserCustomizedTemplate(user.id, template.templateId, template);
            return userTemplate;
          });
          setTemplates(loadedTemplates);
        } else {
          // For non-authenticated users, show all templates
          setTemplates(availableTemplates);
        }
      } catch (error) {
        console.error('Error loading templates:', error);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadTemplates();
  }, [user, isAuthenticated]);

  const handlePreview = (item) => {
    if (onProtectedAction) {
      onProtectedAction('preview', item);
    }
  };
  
  const handleCustomize = (item) => {
    if (onProtectedAction) {
      onProtectedAction('customize', item);
    }
  };
  
  if (loading) {
    return (
      <div className="welcome-container">
        <h1>Website Templates</h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your templates...</p>
        </div>
      </div>
    );
  }
  
  if (!templates || templates.length === 0 && isAuthenticated) {
    return (
      <div className="welcome-container">
        <h1>Website Templates</h1>
        <div className="no-templates">
          <div className="no-templates-icon">🔒</div>
          <h3>No Templates Available</h3>
          <p>You don't have access to any templates. Please contact your administrator.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="welcome-container">
      <h1>Website Templates</h1>
      <p className="template-count">
        {isAuthenticated && user 
          ? `Welcome back, ${user?.name}! You have access to ${templates.length} template(s)` 
          : `${templates.length} beautiful templates available. Login to customize!`
        }
      </p>

      <div className="card-grid">
        {templates.map((item) => (
          <div key={item.templateId} className="preview-card">
            <img 
              src={item.image} 
              alt={item.title} 
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=Template+Image';
              }}
            />
            <div className="card-body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              
              <div className="template-badge">
                {item.themeScope === 'header-footer' && '🏫 Educational'}
                {item.themeScope === 'full-page' && '🎨 Overlay Design'}
                {item.themeScope === 'shopping-cart' && '🛒 E-commerce'}
              </div>

              <div className="card-actions">
                <button className="preview-btn" onClick={() => handlePreview(item)}>
                  👁️ Preview
                </button>
                <button className="edit-btn" onClick={() => handleCustomize(item)}>
                  ✏️ Customize
                </button>
              </div>
              
              {!isAuthenticated && (
                <div className="login-hint">
                  🔒 Login to customize this template
                </div>
              )}
              {isAuthenticated && item.customizedBy === user?.id && (
                <div className="customized-badge">
                  ✨ Customized by you
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}