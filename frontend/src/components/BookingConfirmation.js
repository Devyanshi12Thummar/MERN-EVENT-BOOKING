import React from "react";

const BookingConfirmation = ({ booking }) => (
  <div className="bg-green-50 p-6 rounded-2xl shadow-md text-center max-w-md mx-auto">
    <h2 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h2>
    <p className="text-gray-700 mb-2">Event: {booking.event}</p>
    <p className="text-gray-700 mb-2">Seats Booked: {booking.seatsBooked}</p>
    <p className="text-gray-700 mb-2">Booking ID: {booking.bookingId}</p>
    <p className="text-gray-500 mt-3">Thank you for booking with us!</p>
  </div>
);

export default BookingConfirmation;
