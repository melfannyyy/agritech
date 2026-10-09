import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import Anavbar from './Anavbar';

function Ahome() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [farms, setFarms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, productsRes, farmsRes] = await Promise.all([
          axios.get('http://localhost:5000/users'),
          axios.get('http://localhost:5000/products'),
          axios.get('http://localhost:5000/farms')
        ]);
        
        setUsers(usersRes.data);
        setProducts(productsRes.data);
        setFarms(farmsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data for the bar chart
  const chartData = [
    { name: 'Users', value: users.length, color: '#8b5cf6' }, // purple
    { name: 'Farms', value: farms.length, color: '#ef4444' }, // red
    { name: 'Products', value: products.length, color: '#0d9488' }, // teal
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-300">
      <Anavbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-green-950 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Overview of your agricultural management system
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Total Users" 
            value={users.length} 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            color="purple"
            link="/users"
          />
          
          <StatCard 
            title="Total Farms" 
            value={farms.length} 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            color="red"
            link="/users"
          />
          
          <StatCard 
            title="Total Products" 
            value={products.length} 
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            color="teal"
            link="/getproducts"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Users</h2>
            <div className="space-y-4">
              {users.slice(0, 5).map(user => (
                <div key={user._id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-purple-100 p-2 rounded-full mr-4 text-purple-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Products</h2>
            <div className="space-y-4">
              {products.slice(0, 5).map(product => (
                <div key={product._id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="bg-teal-100 p-2 rounded-full mr-4 text-teal-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
const StatCard = ({ title, value, icon, color, link }) => {
  const colorClasses = {
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    teal: 'bg-teal-100 text-teal-600'
  };

  const hoverClasses = {
    purple: 'hover:bg-purple-600',
    red: 'hover:bg-red-600',
    teal: 'hover:bg-teal-600'
  };

  return (
    <Link to={link} className="no-underline">
      <div className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg ${hoverClasses[color]} hover:text-white group`}>
        <div className="flex justify-between items-center">
          <div className={`p-3 rounded-lg ${colorClasses[color]} group-hover:bg-white group-hover:bg-opacity-20`}>
            {icon}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500 group-hover:text-white">{title}</p>
            <p className="text-3xl font-bold group-hover:text-white">{value}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Ahome;
