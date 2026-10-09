import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';

function BuyProduct() {
  const [item, setItem] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phno: '',
  });
  const [quantity, setQuantity] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/products/${id}`)
      .then((resp) => {
        setItem(resp.data);
        console.log(resp.data);
      })
      .catch((error) => {
        console.log("Failed to fetch item data:", error);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { name, description, price, imgUrl, category } = item;
      if (!description || !price || !name || !imgUrl|| !category) {
        throw new Error('Item data is missing required properties');
      }

      const totalAmount = parseInt(price * quantity, 10) + 45;
      const updatedFormData ={
        ...formData,
        quantity,
        totalamount: totalAmount,
        description,
        imgUrl,
        productName: name,
        category,
      };

      const user = JSON.parse(localStorage.getItem('user'));
      updatedFormData.userId = user.id;
      updatedFormData.userName = user.name;

      console.log("Form Data to be sent:", updatedFormData);

      await axios.post('http://localhost:5000/orderproduct', updatedFormData);
      alert('Ordered successfully');
      navigate('/mybookings');
    } catch (error) {
      console.error('Error booking:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center">
        <div className="max-w-md mx-auto mt-8 p-4 border rounded shadow-lg bg-white">
          <h2 className="text-2xl font-semibold">Your Booking is almost Done!</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-600 text-center" style={{ paddingTop: "10px" }}>Details:</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-48 p-2 border border-gray-300 rounded focus:outline-none"
                  placeholder=" "
                  style={{ width: "340px" }}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <label className="absolute left-2 transform -translate-y-1/2 bg-white px-1 pointer-events-none transition-transform">
                  Name
                </label>
              </div>
            </div>
            <br />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="relative">
                <input
                  type="text"
                  className="w-48 p-2 border border-gray-300 rounded focus:outline-none"
                  placeholder=" "
                  style={{ width: "160px" }}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <label className="absolute left-2 transform -translate-y-1/2 bg-white px-1 pointer-events-none transition-transform">
                  Email
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  className="w-48 p-2 border border-gray-300 rounded focus:outline-none"
                  placeholder=" "
                  style={{ width: "160px" }}
                  name="phno"
                  value={formData.phno}
                  onChange={handleChange}
                />
                <label className="absolute left-2 transform -translate-y-1/2 bg-white px-1 pointer-events-none transition-transform">
                  Phone Number
                </label>
              </div>
            </div>
            <br />
            {item && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '17px' }}>Quantity:</p>
                  <div>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                      style={{ backgroundColor: 'wheat', width: '20px', marginRight: '7px' }}
                    >
                      -
                    </button>
                    {quantity}
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      style={{ backgroundColor: 'wheat', width: '20px', marginLeft: '7px' }}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '17px' }}>Price:</p>
                  <p>₹ {quantity * item.price}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '17px' }}>Convenience Fee:</p>
                  <p>₹ 45</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '17px' }}>Total Amount:</p>
                  <p>₹ {parseInt(quantity * item.price, 10) + 45}</p>
                </div>
              </div>
            )}
            <button
              type="submit"
              style={{ width: '340px' }}
              className="bg-blue-400 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Book
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BuyProduct;
