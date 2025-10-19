const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    totalSeats:{
        type: Number,
        required: true,
    },
    bookedSeats:{
        type: Number,
        required: true,
        default: 0,
    },
    location:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
});
module.exports = mongoose.model("Event", eventSchema);