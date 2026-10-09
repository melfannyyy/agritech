import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (navigator.geolocation) {
        setIsLoading(true);
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=e14698ee9b847e6944a2b35504c54cb2&units=metric`
          );
          setUserLocation(response.data.name);
          setLocation(response.data.name);
        } catch (error) {
          console.error('Error fetching location data:', error);
          setError('Unable to fetch your location. Please search manually.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserLocation();
  }, []);

  const handleSearch = async () => {
    if (!location.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=e14698ee9b847e6944a2b35504c54cb2&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Location not found. Please try another search.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setLocation(e.target.value);
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-min bg-green-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-1 text-center text-green-700 animate-fadeIn">
            Weather Forecast
          </h2>
          
          <div className="mb-6 text-center">
            <p className="text-lg text-green-800 transition-all duration-300 transform hover:scale-105">
              {userLocation ? `Current Location: ${userLocation}` : 'Detecting your location...'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center mb-6 gap-2">
            <input
              type="text"
              value={location}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter location"
              className="w-full sm:w-64 p-1 rounded-lg border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md text-black"
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white p-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-1 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg animate-fadeIn">
              <p>{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center mb-1">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}

          {weatherData && !isLoading && (
            <div className="bg-white rounded-xl pl-5 pr-5 pt-2 pb-2 shadow-xl border border-green-200 transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 animate-fadeIn mb-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                <h3 className="text-2xl font-bold text-green-700">
                  {weatherData.name}, {weatherData.sys?.country}
                </h3>
                <div className="flex items-center mt-2 md:mt-0">
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                    className="w-16 h-16"
                  />
                  <span className="text-xl text-green-800 capitalize">
                    {weatherData.weather[0].description}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <div className="p-4 bg-green-50 rounded-lg transition-all duration-300 hover:bg-green-100">
                  <p className="text-sm text-green-600">Temperature</p>
                  <p className="text-xl font-semibold text-green-800">
                    {weatherData.main.temp}°C
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg transition-all duration-300 hover:bg-green-100">
                  <p className="text-sm text-green-600">Humidity</p>
                  <p className="text-xl font-semibold text-green-800">
                    {weatherData.main.humidity}%
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg transition-all duration-300 hover:bg-green-100">
                  <p className="text-sm text-green-600">Wind Speed</p>
                  <p className="text-xl font-semibold text-green-800">
                    {weatherData.wind.speed} m/s
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg transition-all duration-300 hover:bg-green-100">
                  <p className="text-sm text-green-600">Pressure</p>
                  <p className="text-xl font-semibold text-green-800">
                    {weatherData.main.pressure} hPa
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
