import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CropList = () => {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-800">Crop Information</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crops.map(crop => (
            <div 
              key={crop._id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-60 overflow-hidden">
                <img 
                  src={crop.imgUrl} 
                  alt={crop.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-green-800">{crop.name}</h2>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {crop.season}
                  </span>
                </div>
                
                <p className="text-gray-500 italic mb-4">{crop.scientificName}</p>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-0.5 mr-2 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    <p><span className="font-medium">Growth Duration:</span> {crop.duration}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-0.5 mr-2 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                    </svg>
                    <p><span className="font-medium">Climate:</span> {crop.temperatureRange}, {crop.rainfallRange}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-0.5 mr-2 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                    <p><span className="font-medium">Soil:</span> {crop.soilType}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mt-0.5 mr-2 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p><span className="font-medium">Timing:</span> Sow {crop.sowingTime}, Harvest {crop.harvestTime}</p>
                  </div>
                  
                  <div className="pt-2 mt-4 border-t border-green-100">
                    <div className="flex flex-wrap gap-2">
                      {crop.pesticides.map((pesticide, index) => (
                        <span key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {pesticide}
                        </span>
                      ))}
                      {crop.fertilizers.map((fertilizer, index) => (
                        <span key={`fert-${index}`} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {fertilizer}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CropList;
