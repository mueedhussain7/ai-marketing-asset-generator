import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Image, LogOut, Palette, FolderOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBrandKit } from '../services/brandService';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Brand kit state
  const [brandKit, setBrandKit] = useState<any>(null);
  const [loadingBrand, setLoadingBrand] = useState(true);

  // Fetch brand kit on mount
  useEffect(() => {
    const fetchBrandKit = async () => {
      try {
        const kit = await getBrandKit();
        setBrandKit(kit);
      } catch (error) {
        console.error('Error fetching brand kit:', error);
      } finally {
        setLoadingBrand(false);
      }
    };

    fetchBrandKit();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">
          ✨ AI Designer
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Hi, {user?.name || 'User'}!</span>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Dashboard
          </h1>
          <p className="text-gray-600">
            Create amazing marketing materials in seconds
          </p>
        </div>

        {/* Brand Kit Display */}
        {!loadingBrand && brandKit && (
          <div className="bg-white rounded-xl p-6 mb-8 border-2 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Palette className="text-green-600" />
                Your Brand Kit
              </h2>
              <Link
                to="/brand-setup"
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Edit
              </Link>
            </div>

            <div className="flex items-center gap-8">
              {/* Logo */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Logo</p>
                <img
                  src={brandKit.logo_url}
                  alt="Brand logo"
                  className="h-20 w-auto object-contain border-2 border-gray-200 rounded-lg p-2"
                />
              </div>

              {/* Colors */}
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Brand Colors</p>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-gray-200 mb-1"
                      style={{ backgroundColor: brandKit.primary_color }}
                    />
                    <p className="text-xs text-gray-600">Primary</p>
                    <p className="text-xs font-mono">{brandKit.primary_color}</p>
                  </div>
                  <div className="text-center">
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-gray-200 mb-1"
                      style={{ backgroundColor: brandKit.secondary_color }}
                    />
                    <p className="text-xs text-gray-600">Secondary</p>
                    <p className="text-xs font-mono">{brandKit.secondary_color}</p>
                  </div>
                  <div className="text-center">
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-gray-200 mb-1"
                      style={{ backgroundColor: brandKit.accent_color }}
                    />
                    <p className="text-xs text-gray-600">Accent</p>
                    <p className="text-xs font-mono">{brandKit.accent_color}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions - NOW 3 CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/templates"
            className="bg-indigo-600 text-white p-8 rounded-xl hover:bg-indigo-700 flex flex-col items-center justify-center text-center"
          >
            <Plus size={48} className="mb-4" />
            <h3 className="text-xl font-bold mb-2">Create New Design</h3>
            <p className="text-sm">Start with a template</p>
          </Link>

          <Link
            to="/my-designs"
            className="bg-green-600 text-white p-8 rounded-xl hover:bg-green-700 flex flex-col items-center justify-center text-center"
          >
            <FolderOpen size={48} className="mb-4" />
            <h3 className="text-xl font-bold mb-2">My Designs</h3>
            <p className="text-sm">View saved designs</p>
          </Link>

          <Link
            to="/brand-setup"
            className="bg-white border-2 border-indigo-600 text-indigo-600 p-8 rounded-xl hover:bg-indigo-50 flex flex-col items-center justify-center text-center"
          >
            <Image size={48} className="mb-4" />
            <h3 className="text-xl font-bold mb-2">
              {brandKit ? 'Update Brand Kit' : 'Setup Brand Kit'}
            </h3>
            <p className="text-sm">
              {brandKit ? 'Edit your brand' : 'Upload logo & colors'}
            </p>
          </Link>
        </div>

        {/* Recent Designs Info */}
        <div className="bg-white rounded-xl p-8 text-center">
          <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Saved Designs
          </h2>
          <p className="text-gray-600 mb-6">
            Click "My Designs" above to view, download, and manage all your saved designs
          </p>
          <Link
            to="/my-designs"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            <FolderOpen size={20} />
            View My Designs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;