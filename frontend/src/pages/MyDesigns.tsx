import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Download, Plus, Image as ImageIcon } from 'lucide-react';
import { getUserDesigns, deleteDesign, Design } from '../services/designService';

const MyDesigns: React.FC = () => {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDesigns();
  }, []);

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const data = await getUserDesigns();
      setDesigns(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load designs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteDesign(id);
      setDesigns(designs.filter(d => d.id !== id));
      alert('Design deleted successfully');
    } catch (err: any) {
      alert('Failed to delete design: ' + err.message);
    }
  };

  const handleDownload = async (design: Design) => {
  try {
    // Get the template data first
    const templateResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/templates/${design.template_id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!templateResponse.ok) {
      throw new Error('Failed to fetch template');
    }
    
    const templateData = await templateResponse.json();
    const template = templateData.template;

    // Create temporary full-size container
    const { width, height } = template.dimensions;
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '-99999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = `${width}px`;
    tempContainer.style.height = `${height}px`;
    tempContainer.style.backgroundColor = 'white';
    tempContainer.id = 'temp-download-preview';
    document.body.appendChild(tempContainer);

    // Helper to get color
    const getColor = (colorKey: string): string => {
      if (!design.design_data.brand_colors) return colorKey;
      
      switch (colorKey) {
        case 'primary':
          return design.design_data.brand_colors.primary;
        case 'secondary':
          return design.design_data.brand_colors.secondary;
        case 'accent':
          return design.design_data.brand_colors.accent;
        default:
          return colorKey;
      }
    };

    // Render all elements
    template.elements.forEach((element: any) => {
      if (element.type === 'background') {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.inset = '0';
        div.style.backgroundColor = getColor(element.color);
        tempContainer.appendChild(div);
      }

      if (element.type === 'shape') {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = `${element.position.x}px`;
        div.style.top = `${element.position.y}px`;
        div.style.width = `${element.size.width}px`;
        div.style.height = `${element.size.height}px`;
        div.style.backgroundColor = getColor(element.color);
        tempContainer.appendChild(div);
      }

      if (element.type === 'text') {
        const content = element.name === 'headline' 
          ? design.headline 
          : element.name === 'description' 
          ? design.description 
          : element.content;

        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = `${element.position.x}px`;
        div.style.top = `${element.position.y}px`;
        
        if (element.style.maxWidth) {
          div.style.width = `${element.style.maxWidth}px`;
        }
        
        div.style.fontSize = `${element.style.fontSize}px`;
        div.style.fontWeight = element.style.fontWeight;
        div.style.color = element.style.color === 'primary' 
          ? getColor('primary') 
          : element.style.color;
        div.style.textAlign = element.style.textAlign;
        div.style.lineHeight = `${element.style.lineHeight || 1.2}`;
        div.style.whiteSpace = 'pre-wrap';
        div.style.wordWrap = 'break-word';
        div.style.wordBreak = 'break-word';
        div.style.overflow = 'visible';
        
        div.textContent = content;
        tempContainer.appendChild(div);
      }

      if (element.type === 'logo' && design.design_data.logo_url) {
        const img = document.createElement('img');
        img.src = design.design_data.logo_url;
        img.crossOrigin = 'anonymous';
        img.style.position = 'absolute';
        img.style.left = `${element.position.x}px`;
        img.style.top = `${element.position.y}px`;
        img.style.width = `${element.size.width}px`;
        img.style.height = `${element.size.height}px`;
        img.style.objectFit = 'contain';
        tempContainer.appendChild(img);
      }
    });

    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 300));

    // Import html2canvas dynamically
    const html2canvas = (await import('html2canvas')).default;

    // Capture
    const canvas = await html2canvas(tempContainer, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      width: width,
      height: height,
      windowWidth: width,
      windowHeight: height
    });

    // Clean up
    document.body.removeChild(tempContainer);

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${design.name}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png', 1.0);

  } catch (error) {
    console.error('Download error:', error);
    alert('Failed to download design. Please try again.');
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Designs</h1>
              <p className="text-gray-600 mt-1">
                {designs.length} {designs.length === 1 ? 'design' : 'designs'}
              </p>
            </div>
            <button
              onClick={() => navigate('/templates')}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              <Plus size={20} />
              Create New Design
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {designs.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <ImageIcon size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No designs yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first design to get started!
            </p>
            <button
              onClick={() => navigate('/templates')}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              <Plus size={20} />
              Browse Templates
            </button>
          </div>
        ) : (
          // Designs Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designs.map((design) => (
              <div
                key={design.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <ImageIcon size={48} className="text-white opacity-50" />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {design.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    Template: {design.template_id}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(design.created_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex gap-2">
                  <button
                    onClick={() => handleDownload(design)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(design.id, design.name)}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDesigns;