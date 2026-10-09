const mongoose = require('mongoose');

const bookingschema = new mongoose.Schema({
    name:String,
    email:String,
    phno:String,
    quantity:String,
    totalamount:String,
    productName:String,
    category:String,
    description:String,
    imageURL:String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName:String,
    OrderdDate: {
        type: String,
        default: () => new Date().toLocaleDateString('hi-IN')
    },  
    
})

module.exports = mongoose.model('MyBookingLegacy', bookingschema, 'bookings')
