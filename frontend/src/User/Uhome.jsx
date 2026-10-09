import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Weather from './Weather';

const Uhome = () => {
  const [crops, setCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/cropsdata')
      .then(res => {
        setCrops(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Weather />
      
      <div className="flex-grow p-6 mt-4 bg-green-300 mb-10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center text-green-800 animate-fadeIn">
            Agricultural Information
          </h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {crops.map(crop => (
                <Link 
                  to={`/crop/${crop.name}`} 
                  key={crop._id}
                  className="transform transition-all duration-500 hover:scale-105"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden h-60">
                      <img 
                        src={crop.imgUrl} 
                        alt={crop.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent"></div>
                    </div>
                    <div className="p-6 flex-grow">
                      <h2 className="text-2xl font-semibold text-center text-green-800 mb-2">
                        {crop.name}
                      </h2>
                      <div className="flex justify-center mt-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Learn More
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-green-600 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-lg">&copy; 2024 AgriTech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Uhome;
