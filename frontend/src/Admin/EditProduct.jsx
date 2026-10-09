import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Anavbar from './Anavbar';
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = ({ fetchProducts }) => {
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    imgUrl: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/${id}`);
        setProductData(response.data);
      } catch (error) {
        setError('There was an error fetching the product data!');
        console.error('Error in fetching:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!productData.name || !productData.category || !productData.price || !productData.description || !productData.imgUrl) {
      setError('All fields are required!');
      setIsLoading(false);
      return;
    }

    try {
      await axios.put(`http://localhost:5000/products/${id}`, productData);
      alert('Product updated successfully');
      navigate('/getproducts');
      if (fetchProducts) fetchProducts();
    } catch (error) {
      setError('There was an error updating the product!');
      console.error('Error in updating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Anavbar />
      <form onSubmit={handleSubmit} className="bg-orange-400 shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Product</h2>
        <div className="mb-4">
          <label className="block text-black-900 text-sm font-bold mb-2" htmlFor="name">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productData.name}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="category">
            Category
          </label>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={productData.category}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={productData.price}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={productData.description}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="imgUrl">
            Image URL
          </label>
          <input
            type="text"
            name="imgUrl"
            placeholder="Image URL"
            value={productData.imgUrl}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            {isLoading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default EditProduct;
