import React from "react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition">
      <h2 className="text-xl font-bold">{event.name}</h2>
      <p className="text-gray-500">{event.date}</p>
      <p className="mt-2 text-sm text-gray-700">Location: {event.location}</p>
      <p className="text-sm text-gray-700">
        Seats: {event.bookedSeats}/{event.totalSeats}
      </p>
      <button
        onClick={() => navigate(`/event/${event._id}`)}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Book Now
      </button>
    </div>
  );
};

export default EventCard;
