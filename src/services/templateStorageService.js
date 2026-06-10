// src/services/templateStorageService.js

const STORAGE_KEY = 'user_templates_database';

// Initialize default data from your multisiteData.json
import defaultMultisiteData from '../data/multisiteData.json';

// Get all user templates
export const getAllUserTemplates = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMultisiteData));
    return [...defaultMultisiteData];
  } catch (error) {
    console.error('Error loading templates:', error);
    return [...defaultMultisiteData];
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
    
    if (templateIndex !== -1) {
      // Update existing template
      allTemplates[templateIndex] = {
        ...customizedTemplate,
        id: userId,
        templateId: templateId,
        lastCustomized: new Date().toISOString(),
        isCustomized: true
      };
    } else {
      // Add new template for user (should not happen normally)
      allTemplates.push({
        ...customizedTemplate,
        id: userId,
        templateId: templateId,
        lastCustomized: new Date().toISOString(),
        isCustomized: true
      });
    }
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTemplates));
    
    // Also save to sessionStorage for current session backup
    sessionStorage.setItem(`temp_${userId}_${templateId}`, JSON.stringify(customizedTemplate));
    
    console.log(`✅ Template ${templateId} customized for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error saving customized template:', error);
    return false;
  }
};

// Load customized template for a user
export const loadUserCustomizedTemplate = (userId, templateId) => {
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
    
    return null;
  } catch (error) {
    console.error('Error loading customized template:', error);
    return null;
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
      // Replace with original template
      allTemplates[templateIndex] = {
        ...originalTemplate,
        id: userId,
        templateId: templateId,
        isCustomized: false,
        lastCustomized: null
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allTemplates));
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

// Export user's customizations as JSON file
export const exportUserCustomizations = (userId) => {
  const userTemplates = getUserTemplates(userId);
  const exportData = {
    userId: userId,
    exportDate: new Date().toISOString(),
    templates: userTemplates
  };
  return JSON.stringify(exportData, null, 2);
};

// Import customizations from JSON file
export const importUserCustomizations = (userId, importData) => {
  try {
    const data = typeof importData === 'string' ? JSON.parse(importData) : importData;
    const allTemplates = getAllUserTemplates();
    
    data.templates.forEach(importedTemplate => {
      const index = allTemplates.findIndex(
        t => t.id === userId && t.templateId === importedTemplate.templateId
      );
      
      if (index !== -1) {
        allTemplates[index] = {
          ...importedTemplate,
          id: userId,
          lastCustomized: new Date().toISOString(),
          isCustomized: true
        };
      }
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allTemplates));
    return true;
  } catch (error) {
    console.error('Error importing customizations:', error);
    return false;
  }
};

// Get all templates (for admin)
export const getAllTemplates = () => {
  return getAllUserTemplates();
};