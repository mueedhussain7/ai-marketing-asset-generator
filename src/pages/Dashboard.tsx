import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Image, LogOut } from 'lucide-react';

const Dashboard = () => {
  const userName = "John Doe";
  const designCount = 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-indigo-600">
          ✨ AI Designer
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Hi, {userName}!</span>
          <button className="text-gray-600 hover:text-gray-900">
            <LogOut size={20} />
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

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link 
            to="/create"
            className="bg-indigo-600 text-white p-8 rounded-xl hover:bg-indigo-700 flex items-center justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">Create New Design</h3>
              <p>Start with a template and customize it</p>
            </div>
            <Plus size={48} />
          </Link>

          <Link 
            to="/brand-setup"
            className="bg-white border-2 border-indigo-600 text-indigo-600 p-8 rounded-xl hover:bg-indigo-50 flex items-center justify-between"
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">Setup Brand Kit</h3>
              <p>Upload your logo and colors</p>
            </div>
            <Image size={48} />
          </Link>
        </div>

        {/* Recent Designs Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Designs</h2>
          
          {designCount === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Image size={64} className="mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">
                You haven't created any designs yet
              </p>
              <Link 
                to="/create"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
              >
                Create Your First Design
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Designs will appear here later */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;