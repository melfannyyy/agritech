import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AboutUs from './Aboutus';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans scroll-smooth">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold transition-all duration-300 hover:scale-105">Agri-Tech</h1>
          <nav className="flex items-center space-x-4">
            <a href="#features" className="px-3 py-1 text-lg hover:text-green-200 transition-colors duration-300 rounded hover:bg-green-700">Features</a>
            <a href="#services" className="px-3 py-1 text-lg hover:text-green-200 transition-colors duration-300 rounded hover:bg-green-700">Services</a>
            <a href="#testimonials" className="px-3 py-1 text-lg hover:text-green-200 transition-colors duration-300 rounded hover:bg-green-700">Testimonials</a>
            <a href="#contact" className="px-3 py-1 text-lg hover:text-green-200 transition-colors duration-300 rounded hover:bg-green-700">Contact</a>
            <Link 
              to='/ulogin' 
              className="px-4 py-2 text-lg bg-white text-green-600 rounded-full hover:bg-green-100 transition-all duration-300 hover:shadow-lg"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
  <section className="relative bg-green-100 text-green-900 py-24 overflow-hidden">
    {/* Background Image with Overlay */}
    <div className="absolute inset-0 z-0">
      <img 
        src="/home.webp"
        alt="Agricultural landscape"
        className="w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-green-100 bg-opacity-5"></div>
    </div>
    
    <div className="container mx-auto text-center px-4 relative z-10">
      <h2 className="text-5xl font-bold mb-6 animate-fadeIn">
        Innovative Agriculture Solutions
      </h2>
      <p className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
        Empowering farmers with cutting-edge technology to enhance productivity and sustainability.
      </p>
      <button 
        onClick={() => navigate('/ulogin')} 
        className="bg-green-600 text-white px-8 py-4 rounded-full hover:bg-green-500 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl text-lg font-semibold"
      >
        Get Started
      </button>
    </div>
  </section>

      <AboutUs/>

      {/* Features */}
      <section id="features" className="py-20 bg-green-950">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl  text-white font-bold mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🌱</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Crop Management</h3>
              <p className="text-gray-700">Real-time monitoring of crop health to detect diseases and pests early.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🚜</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Farm Management</h3>
              <p className="text-gray-700">Real-time Farm Management where user can access complete farm management</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">💧</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Irrigation</h3>
              <p className="text-gray-700">Efficient water management systems that save water and improve crop yields.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="bg-green-100 py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Consultancy</h3>
              <p className="text-gray-700">Expert advice on modern farming techniques and practices to enhance productivity.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🧪</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Soil Testing</h3>
              <p className="text-gray-700">Comprehensive soil analysis to recommend the best crops and fertilizers.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl">🛒</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Market Access</h3>
              <p className="text-gray-700">Connecting farmers to buyers and markets to sell their produce at fair prices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-green-950">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl  text-white font-bold mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "AgriTech's solutions have transformed our farming operations. We're seeing higher yields and better efficiency.",
                name: "John Doe"
              },
              {
                quote: "The precision farming tools provided by AgriTech are top-notch. We can now manage our fields more effectively.",
                name: "Jane Smith"
              },
              {
                quote: "Smart irrigation has saved us a lot of water while ensuring our crops get the necessary hydration.",
                name: "Alice Johnson"
              },
              {
                quote: "The market access services helped us find buyers quickly and get better prices for our produce.",
                name: "Robert Brown"
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                <p className="italic text-lg mb-6">"{testimonial.quote}"</p>
                <h4 className="text-xl font-bold text-green-700">— {testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-600 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg">&copy; {new Date().getFullYear()} AgriTech. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-white hover:text-green-200 transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-white hover:text-green-200 transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-white hover:text-green-200 transition-colors duration-300">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
