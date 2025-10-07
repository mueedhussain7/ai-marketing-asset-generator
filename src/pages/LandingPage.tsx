import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Download } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="p-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">
          ✨ AI Designer
        </div>
        <Link 
          to="/login" 
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Create Professional Marketing Images in 
          <span className="text-indigo-600"> 30 Seconds</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          No design skills needed. Just upload, customize, and download. 
          Perfect for small businesses and marketers.
        </p>

        <Link 
          to="/signup" 
          className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700"
        >
          Start Creating Free
        </Link>

        {/* How It Works Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">1. Upload Your Logo</h3>
            <p className="text-gray-600">
              Add your brand logo and colors once. We'll remember them forever.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">2. Pick a Template</h3>
            <p className="text-gray-600">
              Choose from 15+ templates for Instagram, Facebook, and posters.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">3. AI Creates It</h3>
            <p className="text-gray-600">
              Click generate, wait 30 seconds, download your professional design.
            </p>
          </div>
        </div>

        {/* Example Images Placeholder */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold mb-8">See What You Can Create</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Example Design 1</span>
            </div>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Example Design 2</span>
            </div>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Example Design 3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;