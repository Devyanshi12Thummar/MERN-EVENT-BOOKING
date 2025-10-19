import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BookingForm from "../components/BookingForm";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!event) return <p className="text-center mt-10">Loading event...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 text-center">{event.name}</h2>
      <p className="text-center text-gray-500 mb-6">{event.location}</p>
      <BookingForm event={event} />
    </div>
  );
};

export default EventDetail;
