import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Palette, Type } from 'lucide-react';
import { getTemplateById, Template } from '../services/templateService';
import { getBrandKit } from '../services/brandService';

const CreateDesign: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();

  // State
  const [template, setTemplate] = useState<Template | null>(null);
  const [brandKit, setBrandKit] = useState<any>(null);
  const [headline, setHeadline] = useState('Your Headline Here');
  const [description, setDescription] = useState('Your description text here');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load template and brand kit
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        if (!templateId) {
          throw new Error('Template ID is required');
        }

        // Load template and brand kit in parallel
        const [templateData, brandKitData] = await Promise.all([
          getTemplateById(templateId),
          getBrandKit()
        ]);

        setTemplate(templateData);
        setBrandKit(brandKitData);

        // Set default text from template
        const headlineElement = templateData.elements.find(
          (el: any) => el.name === 'headline'
        );
        const descriptionElement = templateData.elements.find(
          (el: any) => el.name === 'description'
        );

        if (headlineElement) setHeadline(headlineElement.content);
        if (descriptionElement) setDescription(descriptionElement.content);

      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [templateId]);

  // Get color based on brand kit
  const getColor = (colorKey: string): string => {
    if (!brandKit) return colorKey;

    switch (colorKey) {
      case 'primary':
        return brandKit.primary_color;
      case 'secondary':
        return brandKit.secondary_color;
      case 'accent':
        return brandKit.accent_color;
      default:
        return colorKey;
    }
  };

  // Render template preview
  const renderPreview = () => {
    if (!template) return null;

    const { width, height } = template.dimensions;
    const scale = Math.min(600 / width, 600 / height);

    return (
      <div
        className="relative bg-white shadow-2xl mx-auto"
        style={{
          width: `${width * scale}px`,
          height: `${height * scale}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left'
        }}
      >
        <div
          className="absolute inset-0"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {template.elements.map((element: any, index: number) => {
            // Render background
            if (element.type === 'background') {
              return (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={{ backgroundColor: getColor(element.color) }}
                />
              );
            }

            // Render shapes
            if (element.type === 'shape') {
              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${element.position.x}px`,
                    top: `${element.position.y}px`,
                    width: `${element.size.width}px`,
                    height: `${element.size.height}px`,
                    backgroundColor: getColor(element.color)
                  }}
                />
              );
            }

            // Render text
            if (element.type === 'text') {
              const content = element.name === 'headline' 
                ? headline 
                : element.name === 'description' 
                ? description 
                : element.content;

              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${element.position.x}px`,
                    top: `${element.position.y}px`,
                    width: element.style.maxWidth ? `${element.style.maxWidth}px` : 'auto',
                    fontSize: `${element.style.fontSize}px`,
                    fontWeight: element.style.fontWeight,
                    color: element.style.color === 'primary' 
                      ? getColor('primary') 
                      : element.style.color,
                    textAlign: element.style.textAlign as any,
                    lineHeight: element.style.lineHeight || 1.2
                  }}
                >
                  {content}
                </div>
              );
            }

            // Render logo
            if (element.type === 'logo' && brandKit?.logo_url) {
              return (
                <img
                  key={index}
                  src={brandKit.logo_url}
                  alt="Logo"
                  className="absolute object-contain"
                  style={{
                    left: `${element.position.x}px`,
                    top: `${element.position.y}px`,
                    width: `${element.size.width}px`,
                    height: `${element.size.height}px`
                  }}
                />
              );
            }

            return null;
          })}
        </div>
      </div>
    );
  };

  const handleSave = () => {
    // For now, just show alert - we'll add save functionality in Milestone 6
    alert('Design saved! (Save functionality coming in Milestone 6)');
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Template not found'}</p>
          <button
            onClick={() => navigate('/templates')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/templates')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              Back to Templates
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              Customize: {template.name}
            </h1>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Save size={20} />
              Save Design
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Customization Form */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Type size={24} className="text-indigo-600" />
                Customize Your Design
              </h2>

              {/* Brand Colors Display */}
              {brandKit && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette size={20} className="text-indigo-600" />
                    <span className="font-semibold text-gray-900">Your Brand Colors</span>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-center">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 mb-1"
                        style={{ backgroundColor: brandKit.primary_color }}
                      />
                      <p className="text-xs text-gray-600">Primary</p>
                    </div>
                    <div className="text-center">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 mb-1"
                        style={{ backgroundColor: brandKit.secondary_color }}
                      />
                      <p className="text-xs text-gray-600">Secondary</p>
                    </div>
                    <div className="text-center">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 mb-1"
                        style={{ backgroundColor: brandKit.accent_color }}
                      />
                      <p className="text-xs text-gray-600">Accent</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Headline Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your headline"
                />
              </div>

              {/* Description Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Enter your description"
                />
              </div>

              {/* Template Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Template Info</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Category:</strong> {template.category}</p>
                  <p><strong>Dimensions:</strong> {template.dimensions.width} × {template.dimensions.height}px</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Live Preview
              </h2>
              <div className="flex items-center justify-center min-h-[400px]">
                {renderPreview()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDesign;