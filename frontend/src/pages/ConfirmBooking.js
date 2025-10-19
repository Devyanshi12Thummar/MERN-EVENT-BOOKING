import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BookingConfirmation from "../components/BookingConfirmation";

const useReviewState = () => {
  const [review, setReview] = useState(null);
  useEffect(() => {
    const raw = sessionStorage.getItem("bookingReview");
    if (raw) {
      try { setReview(JSON.parse(raw)); } catch { setReview(null); }
    }
  }, []);
  return review;
};

const ConfirmBooking = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const review = useReviewState();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(null); 

  useEffect(() => {
    if (!state || !state.eventId || !state.userId || !state.seatsBooked || !state.email) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  const data = state ?? review;
  if (!data) return null;

  const { userId, email, eventId, eventName, seatsBooked, bookingTime, seatNumbers } = data;

  const onConfirm = async () => {
    try {
      setError("");
      setSubmitting(true);
      const payload = {
        userId,
        eventId,
        seats: Number(seatsBooked),  
        seatNumbers: seatNumbers.map(Number),
        email
      };
      const res = await axios.post(
        "http://localhost:5000/api/bookings/book",
        payload
      );
      const booking = res?.data?.booking;
      setConfirmed({
        bookingId: booking?._id,
        event: eventName,
        seatsBooked: booking?.seatBooked ?? Number(seatsBooked),
      });
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to confirm booking.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return <BookingConfirmation booking={confirmed} />;
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Review Your Booking</h2>
      <div className="space-y-2 text-gray-700">
        <div>
          <span className="font-semibold">User ID:</span> {userId}
        </div>
        <div>
          <span className="font-semibold">Event:</span> {eventName}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {email}
        </div>
        <div>
          <span className="font-semibold">Event ID:</span> {eventId}
        </div>
        <div>
          <span className="font-semibold">Seats Booked:</span> {seatsBooked}
        </div>
        <div>
          <span className="font-semibold">Seat Numbers:</span> {Array.isArray(seatNumbers) ? seatNumbers.join(", ") : "-"}
        </div>
        <div>
          <span className="font-semibold">Booking Time:</span> {new Date(bookingTime).toLocaleString()}
        </div>
      </div>

      {error && (
        <p className="mt-4 text-red-600 bg-red-50 border border-red-200 p-3 rounded">{error}</p>
      )}

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          Back
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={onConfirm}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
        >
          {submitting ? "Confirming..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
