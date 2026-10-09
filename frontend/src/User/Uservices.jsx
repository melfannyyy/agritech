// src/components/Services.jsx
import React from 'react';

const services = [
  {
    title: 'Precision Agriculture',
    description: 'Using advanced technology to monitor and optimize crop growth, improving yields and efficiency.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h6l-1.5-1.5L12 4l1.5 1.5L16 10h6M6 20h12" />
      </svg>
    ),
  },
  {
    title: 'Smart Irrigation',
    description: 'Automated irrigation systems that reduce water waste and ensure optimal watering schedules.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Crop Monitoring',
    description: 'Real-time monitoring of crop health using drones and satellite imagery to detect issues early.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h6l-1.5-1.5L12 4l1.5 1.5L16 10h6M6 20h12" />
      </svg>
    ),
  },
  {
    title: 'Soil Analysis',
    description: 'Comprehensive soil testing and analysis to optimize nutrient management and improve crop yields.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V7m10 9V7m-5 4v5m0 4v-5m0-4V7m0 0L5 5m14 0L12 7m0 0V7" />
      </svg>
    ),
  },
];

const Uservices = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Our Services</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Comprehensive Solutions for Modern Agriculture
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Agro Tech offers a range of innovative services designed to enhance agricultural productivity and sustainability.
          </p>
        </div>
        
        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {services.map((service, index) => (
              <div key={index} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                    {service.icon}
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{service.title}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {service.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Uservices;
