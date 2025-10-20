import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Palette, Type, Download } from 'lucide-react';
import { getTemplateById, Template } from '../services/templateService';
import { getBrandKit } from '../services/brandService';
import { saveDesign } from '../services/designService';
import html2canvas from 'html2canvas';

const CreateDesign: React.FC = () => {
    const { templateId } = useParams<{ templateId: string }>();
    const navigate = useNavigate();

    const [template, setTemplate] = useState<Template | null>(null);
    const [brandKit, setBrandKit] = useState<any>(null);
    const [headline, setHeadline] = useState('Your Headline Here');
    const [description, setDescription] = useState('Your description text here');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                if (!templateId) {
                    throw new Error('Template ID is required');
                }

                const [templateData, brandKitData] = await Promise.all([
                    getTemplateById(templateId),
                    getBrandKit()
                ]);

                setTemplate(templateData);
                setBrandKit(brandKitData);

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

    const renderPreview = () => {
        if (!template) return null;

        const { width, height } = template.dimensions;

        // Preview sizes
        let maxWidth, maxHeight;
        if (width > height * 1.5) {
            // Wide landscape (banners)
            maxWidth = 800;
            maxHeight = 450;
        } else {
            // Square or portrait
            maxWidth = 600;
            maxHeight = 650;
        }

        const scale = Math.min(maxWidth / width, maxHeight / height, 1);
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        return (
            <div
                id="design-preview"
                className="relative bg-white shadow-2xl border-2 border-gray-400 mx-auto overflow-hidden"
                style={{
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`
                }}
            >
                {template.elements.map((element: any, index: number) => {
                    // Background
                    if (element.type === 'background') {
                        return (
                            <div
                                key={index}
                                className="absolute inset-0"
                                style={{ backgroundColor: getColor(element.color) }}
                            />
                        );
                    }

                    // Shapes
                    if (element.type === 'shape') {
                        return (
                            <div
                                key={index}
                                className="absolute"
                                style={{
                                    left: `${element.position.x * scale}px`,
                                    top: `${element.position.y * scale}px`,
                                    width: `${element.size.width * scale}px`,
                                    height: `${element.size.height * scale}px`,
                                    backgroundColor: getColor(element.color)
                                }}
                            />
                        );
                    }

                    // Text
                    if (element.type === 'text') {
                        const content = element.name === 'headline'
                            ? headline
                            : element.name === 'description'
                                ? description
                                : element.content;

                        const maxTextHeight = element.style.maxWidth
                            ? (element.style.maxWidth * scale) / 2
                            : undefined;

                        return (
                            <div
                                key={index}
                                className="absolute"
                                style={{
                                    left: `${element.position.x * scale}px`,
                                    top: `${element.position.y * scale}px`,
                                    width: element.style.maxWidth ? `${element.style.maxWidth * scale}px` : 'auto',
                                    maxHeight: maxTextHeight ? `${maxTextHeight}px` : 'none',
                                    fontSize: `${element.style.fontSize * scale}px`,
                                    fontWeight: element.style.fontWeight,
                                    color: element.style.color === 'primary'
                                        ? getColor('primary')
                                        : element.style.color,
                                    textAlign: element.style.textAlign as any,
                                    lineHeight: element.style.lineHeight || 1.2,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: element.name === 'headline' ? 2 : 6,
                                    WebkitBoxOrient: 'vertical'
                                }}
                            >
                                {content}
                            </div>
                        );
                    }

                    // Logo
                    if (element.type === 'logo' && brandKit?.logo_url) {
                        return (
                            <img
                                key={index}
                                src={brandKit.logo_url}
                                alt="Logo"
                                className="absolute object-contain"
                                style={{
                                    left: `${element.position.x * scale}px`,
                                    top: `${element.position.y * scale}px`,
                                    width: `${element.size.width * scale}px`,
                                    height: `${element.size.height * scale}px`
                                }}
                            />
                        );
                    }

                    return null;
                })}
            </div>
        );
    };

    const handleSave = async () => {
        if (!template) return;

        try {
            setSaving(true);

            const designName = prompt('Enter a name for your design:', `${template.name} - ${new Date().toLocaleDateString()}`);

            if (!designName) {
                setSaving(false);
                return;
            }

            await saveDesign({
                template_id: template.id,
                name: designName,
                headline: headline,
                description: description,
                design_data: {
                    template_id: template.id,
                    headline: headline,
                    description: description,
                    brand_colors: brandKit ? {
                        primary: brandKit.primary_color,
                        secondary: brandKit.secondary_color,
                        accent: brandKit.accent_color
                    } : null,
                    logo_url: brandKit?.logo_url || null
                }
            });

            alert('✅ Design saved successfully!');
            navigate('/my-designs');
        } catch (error: any) {
            console.error('Save error:', error);
            alert('❌ Failed to save design: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

const handleDownload = async () => {
    if (!template) return;

    try {
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.textContent = 'Generating...';
        }

        await document.fonts.ready;

        const { width, height } = template.dimensions;

        // Create temporary full-size container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '-99999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = `${width}px`;
        tempContainer.style.height = `${height}px`;
        tempContainer.style.backgroundColor = 'white';
        tempContainer.style.overflow = 'visible';
        tempContainer.id = 'temp-full-preview';
        document.body.appendChild(tempContainer);

        // Render all elements at FULL SIZE
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
                    ? headline 
                    : element.name === 'description' 
                    ? description 
                    : element.content;

                const div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.left = `${element.position.x}px`;
                div.style.top = `${element.position.y}px`;
                
                // IMPORTANT: No maxHeight, no WebkitLineClamp for download!
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
                
                // NO overflow hidden - let text show fully
                div.style.overflow = 'visible';
                
                div.textContent = content;
                tempContainer.appendChild(div);
            }

            if (element.type === 'logo' && brandKit?.logo_url) {
                const img = document.createElement('img');
                img.src = brandKit.logo_url;
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

        // Wait for everything to render
        await new Promise(resolve => setTimeout(resolve, 300));

        // Capture at FULL original size
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
                link.download = `${template.name}-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                if (downloadBtn) {
                    downloadBtn.textContent = 'Download PNG';
                }
            }
        }, 'image/png', 1.0);

    } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download design');
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
            downloadBtn.textContent = 'Download PNG';
        }
    }
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

    const descriptionLength = description.length;
    const isOverCharLimit = descriptionLength > 300;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/templates')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft size={20} />
                            Back
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Customize: {template.name}
                        </h1>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleDownload}
                                id="download-btn"
                                className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                            >
                                <Download size={20} />
                                Download PNG
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                            >
                                <Save size={20} />
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Type size={24} className="text-indigo-600" />
                                Customize
                            </h2>

                            {brandKit && (
                                <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Palette size={20} className="text-indigo-600" />
                                        <span className="font-semibold text-gray-900">Your Brand Colors</span>
                                    </div>
                                    <div className="flex gap-3">
                                        {['primary', 'secondary', 'accent'].map((colorType) => (
                                            <div key={colorType} className="text-center">
                                                <div
                                                    className="w-12 h-12 rounded-lg border-2 border-gray-300 mb-1"
                                                    style={{ backgroundColor: brandKit[`${colorType}_color`] }}
                                                />
                                                <p className="text-xs text-gray-600 capitalize">{colorType}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Headline
                                </label>
                                <input
                                    type="text"
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    maxLength={150}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Enter your headline"
                                />
                                <p className="text-xs text-gray-500 mt-1">Max 150 characters</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    maxLength={300}
                                    rows={6}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${isOverCharLimit ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter your description"
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <p className={`text-xs ${isOverCharLimit ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                        {descriptionLength} / 300 characters
                                        {isOverCharLimit && ' (exceeds limit)'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Press Enter for line breaks
                                    </p>
                                </div>
                                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-xs text-yellow-800">
                                        ⚠️ <strong>Note:</strong> Text is limited by template size. Excess text will be hidden in preview.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">Template Info</h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p><strong>Category:</strong> {template.category}</p>
                                    <p><strong>Size:</strong> {template.dimensions.width} × {template.dimensions.height}px</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Live Preview
                            </h2>
                            <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center" style={{ minHeight: '650px' }}>
                                {renderPreview()}
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-4">
                                Preview shows scaled version. Long text may be truncated.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateDesign;