import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBackspace, FaBezierCurve, FaLongArrowAltLeft, FaLongArrowAltRight, FaSignOutAlt, FaStepBackward } from 'react-icons/fa';
import Nav from '../Components/Nav';

const Usignup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let payload = { name, email, password };

    axios
      .post("http://localhost:5000/usignup", payload)
      .then((result) =>{
        alert('Account created')
        console.log(result)
        navigate('/ulogin')
      })
      .catch((err) => {
        console.log(err);
        alert("Failed to create an account");
      });
  };

  let formHandle1 = (e) => {
    e.preventDefault();
    navigate("/ulogin");
  };

  return (
    <div>
      <Nav/>
    <div className="flex items-center justify-center mt-28 bg-white"> 
   
  
      <div className="relative  bg-green-400 p-8 rounded-md shadow-md overflow-hidden" style={{display:"flex",height:"440px",width:"620px"}}>
     
        <div className="relative z-10" style={{width:"270px"}}>  
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-4"  >
              Signup
            </h2>
            
          </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-800">
              Name
            </label>
            <input
              name="name"
              type="name"
              autoComplete="email"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="bg-red-300 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-indigo-300 transition-all duration-300"
            >
              Signup
            </button>
           
            <p className="text-sm text-gray-900 pt-2" >
            Already have an account{' '}
            <button
              onClick={formHandle1}
              className="text-red-700 hover:underline focus:outline-none focus:ring focus:border-indigo-300 transition-all duration-300"
            >
              Login
            </button>
          </p>
          </div>

         
        </form>
        </div>
        <div>
      <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Ap4TeSE_0CSO85y6WeSpilz7d3K4mtLzGQIyoiRZeQ&s'  style={{marginLeft:"30px",height:"380px",width:"270px"}} />
      </div>
      </div>
    </div>
   </div>
  );
};

export default Usignup;
