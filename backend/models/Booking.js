const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        default: '',
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Event',
    },
    seatBooked:{
        type: Number
    },
    seatNumbers:{
        type: [Number],
        default: [],
    },
    bookingDate:{
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Booking", bookingSchema);