import React, { useState } from 'react';
import axios from 'axios';
import Anavbar from './Anavbar';
import { useNavigate } from 'react-router-dom';

const AddProduct = ({ fetchProducts }) => {
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    imgUrl: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });

    // Update image preview when URL changes
    if (name === 'imgUrl') {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate all fields
    if (!Object.values(productData).every(field => field.trim())) {
      setError('All fields are required!');
      setIsLoading(false);
      return;
    }

    // Validate price
    if (parseFloat(productData.price) <= 0) {
      setError('Price must be greater than 0');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/products', productData);
      
      // Show success and reset form
      alert('Product added successfully!');
      setProductData({
        name: '',
        category: '',
        price: '',
        description: '',
        imgUrl: ''
      });
      setImagePreview('');
      
      // Refresh products and navigate
      if (fetchProducts) fetchProducts();
      navigate('/getproducts');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add product. Please try again.');
      console.error('Error adding product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Anavbar />
      
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Add New Product
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Fill in the details of your new agricultural product
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      value={productData.name}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                      placeholder="e.g., Organic Wheat Flour"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      name="category"
                      value={productData.category}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                    >
                      <option value="">Select a category</option>
                      <option value="Grains">Grains</option>
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Dairy">Dairy</option>
                      <option value="Meat">Meat</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="price"
                      min="0.01"
                      step="0.01"
                      value={productData.price}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                      placeholder="e.g., 199.99"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="description"
                      rows="3"
                      value={productData.description}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                      placeholder="Describe the product features and benefits"
                    ></textarea>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="imgUrl" className="block text-sm font-medium text-gray-700">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="url"
                      name="imgUrl"
                      value={productData.imgUrl}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-300"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                      <img 
                        src={imagePreview} 
                        alt="Product preview" 
                        className="h-40 object-contain rounded-md border border-gray-200"
                        onError={() => setImagePreview('')}
                      />
                    </div>
                  )}
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
                  onClick={() => navigate('/getproducts')}
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
                    'Add Product'
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

export default AddProduct;
