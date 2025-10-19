import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const BookingForm = ({ event }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [bookingTime, setBookingTime] = useState(getNowForDateTimeLocal());
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [seatMap, setSeatMap] = useState(
    Array.isArray(event?.seats)
      ? event.seats
      : Array.from({ length: event?.totalSeats || 0 }, (_, i) => ({
          id: i + 1,
          label: i + 1,
          status: 'available',
        }))
  );

  useEffect(() => {
    setSeatMap(
      Array.isArray(event?.seats)
        ? event.seats
        : Array.from({ length: event?.totalSeats || 0 }, (_, i) => ({
            id: i + 1,
            label: i + 1,
            status: 'available',
          }))
    );
  }, [event]);

  function getNowForDateTimeLocal() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }

  const toggleSeat = (seatId) => {
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const handleBooking = () => {
    setMessage("");

    if (!userId) {
      setMessage("Please enter a User ID.");
      return;
    }
    if (!event?._id) {
      setMessage("Invalid event.");
      return;
    }
    if (selectedSeats.length === 0) {
      setMessage("Select at least one seat.");
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Enter a valid email.");
      return;
    }

    const review = {
      userId,
      email,
      eventId: event._id,
      eventName: event.name,
      seatsBooked: selectedSeats.length,
      seatNumbers: selectedSeats,
      bookingTime,
    };
    sessionStorage.setItem("bookingReview", JSON.stringify(review));
    navigate("/confirm-booking", { state: review });
  };

  useEffect(() => {
    if (!event?._id) return;
    socket.emit('joinEvent', event._id);

    const handleSeatsUpdated = (payload) => {
      if (!payload || payload.eventId !== event._id) return;

      setSeatMap((prev) =>
        prev.map((s, idx) => {
          const seatId = (s?.id ?? idx + 1);
          if (payload.newlyBooked?.includes(seatId)) {
            return { ...s, status: 'booked' };
          }
          return s;
        })
      );
      setSelectedSeats((prev) => prev.filter((id) => !payload.newlyBooked?.includes(id)));
    };

    socket.on('seatsUpdated', handleSeatsUpdated);
    return () => {
      socket.off('seatsUpdated', handleSeatsUpdated);
    };
  }, [event]);

  const seatsBooked = selectedSeats.length;

  return (
    <div>
      <div className="md:grid md:grid-cols-2 md:gap-6">
        <div className="mb-6 md:mb-0">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your user id"
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event ID
                </label>
                <input
                  type="text"
                  value={event?._id || ""}
                  readOnly
                  className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Event
                </label>
                <input
                  type="text"
                  value={event?.name || ""}
                  readOnly
                  className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Seats Booked
                </label>
                <input
                  type="number"
                  value={seatsBooked}
                  readOnly
                  className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Selected Seat Numbers
                </label>
                <input
                  type="text"
                  value={selectedSeats.join(", ")}
                  readOnly
                  className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-700"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Booking Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="mt-1 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-4 mt-4">
            <p className="text-gray-600">
              Selected:{" "}
              <span className="font-bold text-blue-600">
                {selectedSeats.length}
              </span>
            </p>
            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || !userId}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              Review Booking
            </button>
          </div>

          {message && (
            <p className="text-center text-green-600 mt-4 font-medium">
              {message}
            </p>
          )}
        </div>

        <div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 justify-center mb-4">
            {(Array.isArray(seatMap) ? seatMap : Array.from({ length: event.totalSeats }, (_, i) => ({ id: i + 1, status: 'available' })) ).map((s, index) => {
              const seatId = s?.id ?? index + 1;
              const isSelected = selectedSeats.includes(seatId);
              const isBooked = s?.status === 'booked';
              
              return (
                <button
                  key={seatId}
                  disabled={isBooked}
                  onClick={() => toggleSeat(seatId)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-semibold
                    ${isBooked
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-blue-100"
                    } transition`}
                >
                  {seatId}
                </button>
              );
            })}
          </div>
        </div>

          <div className="flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-gray-200 rounded"></div> Available
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-blue-600 rounded"></div> Selected
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-gray-400 rounded"></div> Booked
            </div>
          </div>
        </div>
      </div>
 
  );
};

export default BookingForm;
