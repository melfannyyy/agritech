import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

const GetCrops = () => {
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      axios.get(`http://localhost:5000/getcrops/${user.id}`)
        .then((response) => {
          const taskData = response.data;
          setCrops(taskData);
          console.log(taskData);
        })
        .catch((error) => {
          console.error('Error fetching crops: ', error);
          setError('There was an error fetching the crops data!');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      console.log("User not found in localStorage");
    }
  }, []);

  const handleAddCrop = () => {
    navigate('/addcrop');
  };

  const handleEditCrop = (cropId) => {
    navigate(`/updatecrop/${cropId}`);
  };

  const handleDeleteCrop = async (cropId) => {
    try {
      await axios.delete(`http://localhost:5000/deletecrop/${cropId}`);
      setCrops(crops.filter(crop => crop._id !== cropId));
      alert('Crop deleted successfully');
    } catch (error) {
      console.error('Error deleting crop: ', error);
      setError('There was an error deleting the crop!');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6 w-max">
        <h2 className="text-3xl font-bold mb-6 text-center">Crops List</h2>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <button 
            onClick={handleAddCrop}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4 transition duration-300 ease-in-out"
          >
            Add Crop
          </button>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Variety
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Planted Date
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Estimated Harvest Date
                  </th>
                  <th className="py-2 px-4 border-b-2 border-gray-300 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {crops.length > 0 ? (
                  crops.map((crop, index) => (
                    <tr key={crop._id} className="hover:bg-gray-100 transition-colors duration-200">
                      <td className="py-2 px-4 border-b border-gray-300">{index + 1}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{crop.name}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{crop.variety}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{crop.quantity}</td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {new Date(crop.plantedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        {new Date(crop.estimatedHarvestDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-2 px-4 border-b border-gray-300">
                        <button
                          onClick={() => handleEditCrop(crop._id)}
                          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCrop(crop._id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : 
                (
                  <tr>
                    <td colSpan="7" className="py-2 px-4 border-b border-gray-300">
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20vh" }}>
                        <p className="text-4xl font-extrabold text-center">No Crops Added</p>
                      </div>
                    </td>
                  </tr>
                )
                }
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetCrops;
