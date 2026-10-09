import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  

  return (
    <nav className="bg-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white text-3xl font-bold">
                Agri-Tech
              </Link>
            </div>
          </div>
          <div className="hidden md:flex ml-auto">
            <div className="flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-white px-3 py-2 rounded-md text-lg font-medium hover:text-green-200"
              >
                Home
              </Link>
              <Link
                to="/ulogin"
                className="text-white px-3 py-2 rounded-md text-lg font-medium hover:text-green-200"
              >
                User Login
              </Link>
              <Link
                to="/alogin"
                className="text-white px-3 py-2 rounded-md text-lg font-medium hover:text-green-200"
              >
                Admin Login
              </Link>
            </div>
            </div>
            </div>
            </div>

    </nav>
  );
};

export default Nav;
