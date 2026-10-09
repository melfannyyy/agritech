import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

const AddCrop = ({ fetchCrops }) => {
  const [cropData, setCropData] = useState({
    name: '',
    variety: '',
    quantity: '',
    plantedDate: '',
    estimatedHarvestDate: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCropData({
      ...cropData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate all fields
    if (!Object.values(cropData).every(field => field.trim())) {
      setError('All fields are required!');
      setIsLoading(false);
      return;
    }

    // Validate dates
    if (new Date(cropData.estimatedHarvestDate) <= new Date(cropData.plantedDate)) {
      setError('Harvest date must be after planted date!');
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
      await axios.post('http://localhost:5000/addcrop', {
        ...cropData,
        userId: user.id,
        userName: user.name
      });
      
      // Success handling
      setCropData({
        name: '',
        variety: '',
        quantity: '',
        plantedDate: '',
        estimatedHarvestDate: ''
      });
      
      setError(null);
      alert('Crop added successfully!');
      
      if (fetchCrops) fetchCrops();
      navigate('/getcrops');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add crop. Please try again.');
      console.error('Error adding crop:', error);
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
                Add New Crop
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Fill in the details of your new crop planting
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Crop Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    value={cropData.name}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    placeholder="e.g., Wheat, Rice, Corn"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="variety" className="block text-sm font-medium text-gray-700">
                  Variety
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="variety"
                    value={cropData.variety}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    placeholder="e.g., Golden, Hybrid"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity (acres/kg)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={cropData.quantity}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="plantedDate" className="block text-sm font-medium text-gray-700">
                    Planted Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="plantedDate"
                      value={cropData.plantedDate}
                      onChange={handleChange}
                      required
                      max={new Date().toISOString().split('T')[0]}
                      className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="estimatedHarvestDate" className="block text-sm font-medium text-gray-700">
                    Harvest Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="estimatedHarvestDate"
                      value={cropData.estimatedHarvestDate}
                      onChange={handleChange}
                      required
                      min={cropData.plantedDate || new Date().toISOString().split('T')[0]}
                      className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    />
                  </div>
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
                  onClick={() => navigate('/getcrops')}
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
                      Adding...
                    </>
                  ) : (
                    'Add Crop'
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

export default AddCrop;
