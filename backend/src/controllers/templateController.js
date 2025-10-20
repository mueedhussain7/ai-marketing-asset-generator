const templates = require('../data/templates.json');

// Get all templates
const getAllTemplates = async (req, res) => {
  try {
    res.json({
      success: true,
      count: templates.length,
      templates: templates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};

// Get single template by ID
const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = templates.find(t => t.id === id);

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json({
      success: true,
      template: template
    });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
};

// Get templates by category
const getTemplatesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const filteredTemplates = templates.filter(
      t => t.category.toLowerCase() === category.toLowerCase()
    );

    res.json({
      success: true,
      count: filteredTemplates.length,
      templates: filteredTemplates
    });
  } catch (error) {
    console.error('Get templates by category error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
};

// Get all unique categories
const getCategories = async (req, res) => {
  try {
    const categories = [...new Set(templates.map(t => t.category))];
    
    res.json({
      success: true,
      categories: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

module.exports = {
  getAllTemplates,
  getTemplateById,
  getTemplatesByCategory,
  getCategories
};