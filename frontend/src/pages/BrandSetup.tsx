import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Palette, Save } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { HexColorPicker } from 'react-colorful';
import { getBrandKit } from '../services/brandService';

const BrandSetup: React.FC = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState('#FF5733');
  const [secondaryColor, setSecondaryColor] = useState('#33FF57');
  const [accentColor, setAccentColor] = useState('#3357FF');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Load existing brand kit when page loads
  useEffect(() => {
    const loadExistingBrand = async () => {
      try {
        const kit = await getBrandKit();
        if (kit) {
          setLogoPreview(kit.logo_url);
          setPrimaryColor(kit.primary_color);
          setSecondaryColor(kit.secondary_color);
          setAccentColor(kit.accent_color);
        }
      } catch (error) {
        console.error('Error loading brand kit:', error);
      }
    };

    loadExistingBrand();
  }, []);

  // Drag & drop setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    try {
      let logo_url = logoPreview; // Use existing logo URL by default

      // Only upload new logo if user selected a new file
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);

        const token = localStorage.getItem('token');
        
        const uploadResponse = await fetch(`${API_URL}/brands/upload-logo`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload logo');
        }

        const uploadData = await uploadResponse.json();
        logo_url = uploadData.logo_url; // Use new logo URL
      }

      // Check if we have a logo URL (either existing or newly uploaded)
      if (!logo_url) {
        setError('Please upload a logo');
        setUploading(false);
        return;
      }

      // Save brand kit with colors
      const token = localStorage.getItem('token');
      const saveResponse = await fetch(`${API_URL}/brands`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          logo_url,
          primary_color: primaryColor,
          secondary_color: secondaryColor,
          accent_color: accentColor
        })
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save brand kit');
      }

      // Success! Go to dashboard
      alert('Brand kit saved successfully! 🎉');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set Up Your Brand Kit
          </h1>
          <p className="text-gray-600 mb-8">
            Upload your logo and choose your brand colors
          </p>

          <form onSubmit={handleSubmit}>
            {/* Logo Upload Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Upload className="inline w-5 h-5 mr-2" />
                Upload Logo
              </label>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                
                {logoPreview ? (
                  <div>
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-h-48 mx-auto mb-4"
                    />
                    <p className="text-sm text-gray-600">
                      Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      {isDragActive
                        ? 'Drop your logo here...'
                        : 'Drag & drop your logo, or click to browse'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Color Pickers Section */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Palette className="inline w-5 h-5 mr-2" />
                Brand Colors
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Primary Color */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </p>
                  <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-center font-mono"
                  />
                </div>

                {/* Secondary Color */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </p>
                  <HexColorPicker color={secondaryColor} onChange={setSecondaryColor} />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-center font-mono"
                  />
                </div>

                {/* Accent Color */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </p>
                  <HexColorPicker color={accentColor} onChange={setAccentColor} />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-center font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !logoPreview}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {uploading ? (
                <>Processing...</>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Brand Kit
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandSetup;