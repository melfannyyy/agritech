import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar';

const UpdateCrop = ({ cropId, fetchCrops }) => {
  const [cropData, setCropData] = useState({
    name: '',
    variety: '',
    quantity: '',
    plantedDate: '',
    estimatedHarvestDate: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/getcrop/${id}`);
        const crop = response.data;
        // Format the dates
        crop.plantedDate = crop.plantedDate.split('T')[0];
        crop.estimatedHarvestDate = crop.estimatedHarvestDate.split('T')[0];
        setCropData(crop);
      } catch (error) {
        setError('Error fetching crop data');
      }
    };

    fetchCrop();
  }, [id]);

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

    try {
      await axios.put(`http://localhost:5000/editcrop/${id}`, cropData);
      alert('Crop updated successfully');
      navigate('/getcrops')
      if (fetchCrops) fetchCrops();
    } catch (error) {
      setError('There was an error updating the crop!');
      console.error('Error in updating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar/>
      <form onSubmit={handleSubmit} className="bg-orange-400 shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto mt-9">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Crop</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={cropData.name}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="variety">
          Variety
        </label>
        <input
          type="text"
          name="variety"
          placeholder="Variety"
          value={cropData.variety}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
          Quantity
        </label>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={cropData.quantity}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plantedDate">
          Planted Date
        </label>
        <input
          type="date"
          name="plantedDate"
          placeholder="Planted Date"
          value={cropData.plantedDate}
          onChange={handleChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estimatedHarvestDate">
          Estimated Harvest Date
        </label>
        <input
          type="date"
          name="estimatedHarvestDate"
          placeholder="Estimated Harvest Date"
          value={cropData.estimatedHarvestDate}
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
          {isLoading ? 'Updating...' : 'Update Crop'}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
    </form>
    </div>
  );
};

export default UpdateCrop;
