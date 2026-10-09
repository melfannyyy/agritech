import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Anavbar from './Anavbar';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [crops, setCrops] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log('Failed to fetch users.');
      });
  }, []);

  const deleteData = (userId) => {
    axios.delete(`http://localhost:5000/userdelete/${userId}`)
      .then(() => {
        alert('User deleted successfully.');
        setUsers(users.filter(user => user._id !== userId));
      })
      .catch((error) => {
        console.log('Failed to delete user.');
      });
  };

  const fetchUserDetails = (userId) => {
    axios.get(`http://localhost:5000/getfarms/${userId}`)
      .then((response) => {
        setItems(response.data);
        toggleDetails();
      })
      .catch((error) => {
        console.log('Error fetching farms data');
      });

    axios.get(`http://localhost:5000/getcrops/${userId}`)
      .then((response) => {
        setCrops(response.data);
        toggleDetails();
      })
      .catch((error) => {
        console.log('Error fetching crops data');
      });
  };

  return (
    <div className="bg-white min-h-screen">
      <Anavbar />
      <div className="container mx-auto p-5 bg-white shadow-lg rounded-lg w-[1000px] mt-20">
        <h1 className="text-center text-3xl font-bold text-gray-700">Users</h1>
        <table className="min-w-full sm:w-3/4 lg:w-1/2 mx-auto divide-y divide-gray-200 mt-5">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl/No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UserId</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user._id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <Link to={`/useredit/${user._id}`} className="text-blue-500 hover:text-blue-700 mr-2">
                    <FaEdit />
                  </Link>
                  <button onClick={() => deleteData(user._id)} className="text-red-500 hover:text-red-700 mr-2">
                    <FaTrash />
                  </button>
                  <button onClick={() => fetchUserDetails(user._id)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-900 bg-opacity-50 absolute inset-0" onClick={toggleDetails}></div>
          <div className="bg-white p-6 rounded-lg z-10 relative max-h-[80vh] overflow-y-auto w-3/4">
            <h1 className="text-center text-blue-600 text-4xl">User Info</h1>
            <div className="container mx-auto mt-8">
              <h2 className="text-center text-2xl font-bold text-gray-700">Farms</h2>
              <div>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <div key={item._id} className="mb-4 bg-gray-50 p-4 shadow-lg rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <p>{index + 1})</p>
                          <p><span className="font-bold">Area Size:</span> {item.areaSize} acres</p>
                          <p><span className="font-bold">Crop Type:</span> {item.cropType}</p>
                          <p><span className="font-bold">Location:</span> {item.location}</p>
                          <p><span className="font-bold">User Name:</span> {item.userName}</p>
                          <p><span className="font-bold">Form Created At:</span> {new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <h1 className="text-center font-extrabold text-3xl">No Farms Data Found</h1>
                  </div>
                )}
              </div>

              <h2 className="text-center text-2xl font-bold text-gray-700">Crops</h2>
              <div>
                {crops.length > 0 ? (
                  crops.map((crop, index) => (
                    <div key={crop._id} className="mb-4 bg-gray-50 p-4 shadow-lg rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <p>{index + 1})</p>
                          <p><span className="font-bold">Name:</span> {crop.name}</p>
                          <p><span className="font-bold">Variety:</span> {crop.variety}</p>
                          <p><span className="font-bold">Planted Date:</span> {new Date(crop.plantedDate).toLocaleDateString()}</p>
                          <p><span className="font-bold">Estimated Harvest Date:</span> {new Date(crop.estimatedHarvestDate).toLocaleDateString()}</p>
                          <p><span className="font-bold">Quantity:</span> {crop.quantity} quintal</p>
                          <p><span className="font-bold">User Name:</span> {crop.userName}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <h1 className="text-center font-extrabold text-3xl">No Crops Data Found</h1>
                  </div>
                )}
              </div>
            </div>
            <button onClick={toggleDetails} className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
