import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import Navbar from '../Navbar';

const UpdateFarm = () => {
  const { id } = useParams();
  const [farmData, setFarmData] = useState({
    name: '',
    location: '',
    areaSize: '',
    cropType: '',
    createdAt: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/getfarm/${id}`)
      .then((response) => {
        const formattedData = {
          ...response.data,
          createdAt: moment(response.data.createdAt).format('YYYY-MM-DD')
        };
        setFarmData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching farm data:', error);
        setError('There was an error fetching the farm data!');
      });
  }, [id]);

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

    try {
      await axios.put(`http://localhost:5000/editfarm/${id}`, farmData);
      alert('Farm updated successfully');
      navigate('/getfarms');
    } catch (error) {
      setError('There was an error updating the farm!');
      console.error('Error in updating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-orange-400 shadow-md rounded px-8 pt-2 pb-8 mb-3 max-w-lg mx-auto mt-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Update Farm</h2>
        <div className="mb-4">
          <label className="block text-black-900 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={farmData.name}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={farmData.location}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="areaSize">
            Area Size
          </label>
          <input
            type="number"
            name="areaSize"
            placeholder="Area Size"
            value={farmData.areaSize}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="cropType">
            Crop Type
          </label>
          <input
            type="text"
            name="cropType"
            placeholder="Crop Type"
            value={farmData.cropType}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-900 text-sm font-bold mb-2" htmlFor="createdAt">
            Created At
          </label>
          <input
            type="date"
            name="createdAt"
            placeholder="Created At"
            value={farmData.createdAt}
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
            {isLoading ? 'Updating...' : 'Update Farm'}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs italic mt-4">{error}</p>}
      </form>
    </div>
    </div>
  );
};

export default UpdateFarm;
