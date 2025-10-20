const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export interface Template {
  id: string;
  name: string;
  category: string;
  dimensions: {
    width: number;
    height: number;
  };
  thumbnail: string;
  description: string;
  elements: any[];
}

export const getAllTemplates = async (): Promise<Template[]> => {
  const response = await fetch(`${API_URL}/templates`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }
  
  const data = await response.json();
  return data.templates;
};

export const getTemplateById = async (id: string): Promise<Template> => {
  const response = await fetch(`${API_URL}/templates/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch template');
  }
  
  const data = await response.json();
  return data.template;
};

export const getTemplatesByCategory = async (category: string): Promise<Template[]> => {
  const response = await fetch(`${API_URL}/templates/category/${category}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }
  
  const data = await response.json();
  return data.templates;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/templates/categories`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  
  const data = await response.json();
  return data.categories;
};