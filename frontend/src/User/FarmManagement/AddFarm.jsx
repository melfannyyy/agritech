import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

const AddFarm = ({ fetchCrops }) => {
  const [farmData, setFarmData] = useState({
    name: '',
    location: '',
    areaSize: '',
    cropType: '',
    createdAt: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmData({
      ...farmData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate required fields
    if (!farmData.name || !farmData.location || !farmData.areaSize || !farmData.cropType) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Validate area size
    if (parseFloat(farmData.areaSize) <= 0) {
      setError('Area size must be greater than 0');
      setIsLoading(false);
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/addfarm', {
        ...farmData,
        userId: user.id,
        userName: user.name
      });
      
      // Reset form on success
      setFarmData({
        name: '',
        location: '',
        areaSize: '',
        cropType: '',
        createdAt: new Date().toISOString().split('T')[0]
      });
      
      alert('Farm added successfully!');
      if (fetchCrops) fetchCrops();
      navigate('/getfarms');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add farm. Please try again.');
      console.error('Error adding farm:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Register New Farm
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Provide details about your agricultural land
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Farm Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    value={farmData.name}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    placeholder="e.g., Green Valley Farm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    value={farmData.location}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    placeholder="e.g., County, State"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="areaSize" className="block text-sm font-medium text-gray-700">
                    Area Size (acres) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="areaSize"
                      min="0.1"
                      step="0.1"
                      value={farmData.areaSize}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                      placeholder="e.g., 5.2"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">
                    Established Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="createdAt"
                      value={farmData.createdAt}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="cropType" className="block text-sm font-medium text-gray-700">
                  Primary Crop Type <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="cropType"
                    value={farmData.cropType}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    placeholder="e.g., Wheat, Corn, Soybeans"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigate('/getfarms')}
                  className="inline-flex items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    'Register Farm'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFarm;
