import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Mybookings() {
  const [bookings, setBookings] = useState([]);  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBooking, setNewBooking] = useState({
    productName: '',
    quantity: 1,
    bookingDate: new Date().toISOString().split('T')[0],
    totalamount: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      axios.get(`http://localhost:5000/getbookings/${user.id}`)
        .then((response) => {
          setBookings(response.data);
        })
        .catch((error) => {
          console.error('Error fetching bookings: ', error);
        });  
    }
  };

  const handleAddBooking = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    axios.post('http://localhost:5000/orderproduct', {
      ...newBooking,
      userId: user.id,
      userName: user.name,
      OrderdDate: new Date().toISOString()
    })
    .then(() => {
      fetchBookings();
      setShowAddForm(false);
      setNewBooking({
        productName: '',
        quantity: 1,
        bookingDate: new Date().toISOString().split('T')[0],
        totalamount: 0
      });
    })
    .catch(error => {
      console.error('Error adding booking:', error);
    });
  };

  const calculateStatus = (bookingDate) => {
    const currentDate = new Date();
    const bookingDateObj = new Date(bookingDate);
    
    if (currentDate > bookingDateObj) {
      return 'Completed';
    }
    
    const diffTime = bookingDateObj - currentDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
      return 'Processing';
    } else if (diffDays <= 7) {
      return 'Scheduled';
    } else {
      return 'Upcoming';
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            + Add New Booking
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Booking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={newBooking.productName}
                  onChange={(e) => setNewBooking({...newBooking, productName: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={newBooking.quantity}
                  onChange={(e) => setNewBooking({...newBooking, quantity: parseInt(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
                <input
                  type="date"
                  value={newBooking.bookingDate}
                  onChange={(e) => setNewBooking({...newBooking, bookingDate: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <input
                  type="number"
                  min="0"
                  value={newBooking.totalamount}
                  onChange={(e) => setNewBooking({...newBooking, totalamount: parseFloat(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddBooking}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = calculateStatus(booking.OrderdDate);
              const statusColor = getStatusColor(status);

              return (
                <div 
                  key={booking._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="text-sm text-gray-500">Booking ID</p>
                      <p className="font-medium">{booking._id.slice(0, 8)}...</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Product</p>
                      <p className="font-medium">{booking.productName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {new Date(booking.OrderdDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="font-medium">{booking.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium">₹{booking.totalamount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings yet</h3>
            <p className="mt-1 text-gray-500">
              Get started by adding a new booking.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Mybookings;
