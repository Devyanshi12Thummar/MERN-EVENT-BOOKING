const Event = require("../models/Event");
const Booking = require("../models/Booking");
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const bookings = await Booking.find({ eventId: event._id }, 'seatNumbers');
    const bookedSet = new Set();
    bookings.forEach(b => {
      (b.seatNumbers || []).forEach(n => bookedSet.add(Number(n)));
    });

    const seats = Array.from({ length: event.totalSeats }, (_, i) => {
      const id = i + 1;
      return {
        id,
        label: id,
        status: bookedSet.has(id) ? 'booked' : 'available',
      };
    });

    const payload = { ...event.toObject(), seats };
    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};