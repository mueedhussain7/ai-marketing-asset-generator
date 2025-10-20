import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Grid3x3, Sparkles } from 'lucide-react';
import { getAllTemplates, getCategories, getTemplatesByCategory, Template } from '../services/templateService';

const TemplateGallery: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch templates and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [templatesData, categoriesData] = await Promise.all([
          getAllTemplates(),
          getCategories()
        ]);
        
        setTemplates(templatesData);
        setCategories(['All', ...categoriesData]);
      } catch (err: any) {
        setError(err.message || 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter templates by category
  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);

    try {
      if (category === 'All') {
        const allTemplates = await getAllTemplates();
        setTemplates(allTemplates);
      } else {
        const filteredTemplates = await getTemplatesByCategory(category);
        setTemplates(filteredTemplates);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to filter templates');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to customization page
  const handleTemplateSelect = (templateId: string) => {
    navigate(`/create/${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-2 text-indigo-600">
              <Grid3x3 size={24} />
              <span className="font-semibold">Template Gallery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title & Description */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Choose a Template
          </h1>
          <p className="text-gray-600 text-lg">
            Select a professional template and customize it with your brand
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* Template Grid */}
        {!loading && templates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
              >
                {/* Template Thumbnail */}
                <div className="relative aspect-square bg-gray-100">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-medium text-indigo-600 shadow-sm">
                    {template.category}
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {template.dimensions.width} × {template.dimensions.height}
                    </span>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                      <Sparkles size={16} />
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && templates.length === 0 && (
          <div className="text-center py-20">
            <Grid3x3 size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No templates found
            </h3>
            <p className="text-gray-600">
              Try selecting a different category
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateGallery;