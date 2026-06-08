// src/utils/userTemplateStorage.js

const STORAGE_KEY = 'user_templates_database';

// Get all user templates from localStorage
export const getAllUserTemplates = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error loading user templates:', error);
    return [];
  }
};

// Save all user templates to localStorage
export const saveAllUserTemplates = (templates) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
    return true;
  } catch (error) {
    console.error('Error saving user templates:', error);
    return false;
  }
};

// Get templates for a specific user
export const getUserTemplates = (userId) => {
  const allTemplates = getAllUserTemplates();
  return allTemplates.filter(template => template.id === userId);
};

// Get specific template for a user
export const getUserTemplate = (userId, templateId) => {
  const allTemplates = getAllUserTemplates();
  return allTemplates.find(template => template.id === userId && template.templateId === templateId);
};

// Save/Update a customized template for a specific user
export const saveUserCustomizedTemplate = (userId, templateId, customizedTemplate) => {
  try {
    const allTemplates = getAllUserTemplates();
    
    // Find the index of the template to update
    const templateIndex = allTemplates.findIndex(
      template => template.id === userId && template.templateId === templateId
    );
    
    const updatedTemplate = {
      ...customizedTemplate,
      id: userId,
      templateId: templateId,
      lastCustomized: new Date().toISOString(),
      isCustomized: true
    };
    
    if (templateIndex !== -1) {
      // Update existing template
      allTemplates[templateIndex] = updatedTemplate;
    } else {
      // Add new template for user
      allTemplates.push(updatedTemplate);
    }
    
    // Save back to localStorage
    saveAllUserTemplates(allTemplates);
    
    // Also save to sessionStorage for current session backup
    sessionStorage.setItem(`temp_${userId}_${templateId}`, JSON.stringify(updatedTemplate));
    
    console.log(`✅ Template ${templateId} customized for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error saving customized template:', error);
    return false;
  }
};

// Load customized template for a user
export const loadUserCustomizedTemplate = (userId, templateId, originalTemplate) => {
  try {
    // Check sessionStorage first (for unsaved changes)
    const sessionData = sessionStorage.getItem(`temp_${userId}_${templateId}`);
    if (sessionData) {
      return JSON.parse(sessionData);
    }
    
    // Then check localStorage
    const template = getUserTemplate(userId, templateId);
    if (template && template.isCustomized) {
      return template;
    }
    
    // If no customization exists, return original template with user ID
    if (originalTemplate) {
      return {
        ...originalTemplate,
        id: userId,
        templateId: templateId,
        isCustomized: false,
        createdAt: new Date().toISOString()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error loading customized template:', error);
    return originalTemplate || null;
  }
};

// Reset template to original (delete customization)
export const resetUserTemplate = (userId, templateId, originalTemplate) => {
  try {
    const allTemplates = getAllUserTemplates();
    const templateIndex = allTemplates.findIndex(
      template => template.id === userId && template.templateId === templateId
    );
    
    if (templateIndex !== -1) {
      if (originalTemplate) {
        // Replace with original template
        allTemplates[templateIndex] = {
          ...originalTemplate,
          id: userId,
          templateId: templateId,
          isCustomized: false,
          lastCustomized: null
        };
      } else {
        // Remove the template entirely
        allTemplates.splice(templateIndex, 1);
      }
      
      saveAllUserTemplates(allTemplates);
      sessionStorage.removeItem(`temp_${userId}_${templateId}`);
      
      console.log(`✅ Template ${templateId} reset to original for user ${userId}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error resetting template:', error);
    return false;
  }
};

// Export user's customizations as JSON string
export const exportUserCustomizations = (userId) => {
  const userTemplates = getUserTemplates(userId);
  const exportData = {
    userId: userId,
    exportDate: new Date().toISOString(),
    totalTemplates: userTemplates.length,
    templates: userTemplates
  };
  return JSON.stringify(exportData, null, 2);
};

// Import customizations from JSON file
export const importUserCustomizations = (userId, importData) => {
  try {
    const data = typeof importData === 'string' ? JSON.parse(importData) : importData;
    const allTemplates = getAllUserTemplates();
    
    if (data.templates && Array.isArray(data.templates)) {
      data.templates.forEach(importedTemplate => {
        const index = allTemplates.findIndex(
          t => t.id === userId && t.templateId === importedTemplate.templateId
        );
        
        const templateToImport = {
          ...importedTemplate,
          id: userId,
          lastCustomized: new Date().toISOString(),
          isCustomized: true
        };
        
        if (index !== -1) {
          allTemplates[index] = templateToImport;
        } else {
          allTemplates.push(templateToImport);
        }
      });
      
      saveAllUserTemplates(allTemplates);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing customizations:', error);
    return false;
  }
};

// Delete all customizations for a user
export const deleteAllUserCustomizations = (userId) => {
  try {
    const allTemplates = getAllUserTemplates();
    const filteredTemplates = allTemplates.filter(template => template.id !== userId);
    saveAllUserTemplates(filteredTemplates);
    
    // Clear session storage for this user
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith(`temp_${userId}_`)) {
        sessionStorage.removeItem(key);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting user customizations:', error);
    return false;
  }
};

// Check if user has customization for a template
export const hasUserCustomization = (userId, templateId) => {
  const template = getUserTemplate(userId, templateId);
  return template && template.isCustomized === true;
};

// Get all templates (for admin)
export const getAllTemplates = () => {
  return getAllUserTemplates();
};

// Clear all data (for testing/reset)
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Clear all session storage temp items
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (key.startsWith('temp_')) {
        sessionStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};