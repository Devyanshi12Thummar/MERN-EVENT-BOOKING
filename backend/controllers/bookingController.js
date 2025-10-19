const Event = require('../models/Event');
const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');

exports.bookSeats = async (req, res) => {
    try {
        const { eventId, userId, email } = req.body;
        const seatsRaw = req.body.seats ?? req.body.seatBooked;
        const seats = Number(seatsRaw);
        const seatNumbers = Array.isArray(req.body.seatNumbers) ? req.body.seatNumbers.map(Number) : [];

        if (!eventId || !userId || !Number.isFinite(seats) || seats <= 0) {
            return res.status(400).json({ message: 'Invalid input. Provide eventId, userId and a positive number of seats.' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const existingBooking = await Booking.findOne({
            eventId,
            seatNumbers: { $in: seatNumbers }
        });

        if (existingBooking) {
            return res.status(400).json({ 
                message: 'One or more selected seats are already booked',
                conflictingSeats: seatNumbers.filter(seat => 
                    existingBooking.seatNumbers.includes(seat)
                )
            });
        }

        if (event.bookedSeats + seats > event.totalSeats) {
            return res.status(400).json({ message: 'Not enough available seats' });
        }

        event.bookedSeats += seats;
        await event.save();

        const booking = await Booking.create({ 
            eventId, 
            userId,
            email: email || '',
            seatBooked: seats, 
            seatNumbers 
        });

        try {
            const io = req.app.get('io');
            if (io) {
                io.to(`event:${eventId}`).emit('seatsUpdated', {
                    eventId,
                    bookedSeatsCount: event.bookedSeats,
                    newlyBooked: seatNumbers,
                });
            }
        } catch {}

        try {
            if (email) {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT || 587),
                    secure: Boolean(process.env.SMTP_SECURE === 'true'),
                    auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    } : undefined,
                });

                const seatList = seatNumbers.join(', ');
                const mailOptions = {
                    from: process.env.MAIL_FROM || 'no-reply@example.com',
                    to: email,
                    subject: `Booking Confirmation - ${event.name}`,
                    html: `
                        <p>Hi ${userId},</p>
                        <p>Your booking for <strong>${event.name}</strong> is confirmed.</p>
                        <p>
                          Seats: <strong>${seats}</strong><br/>
                          Seat Numbers: <strong>${seatList}</strong><br/>
                          Event Date: <strong>${new Date(event.date).toLocaleString()}</strong><br/>
                          Location: <strong>${event.location}</strong><br/>
                          Booking ID: <strong>${booking._id}</strong>
                        </p>
                        <p>Thank you for booking with us!</p>
                    `,
                    text: `Hi ${userId},\nYour booking for ${event.name} is confirmed.\nSeats: ${seats}\nSeat Numbers: ${seatList}\nEvent Date: ${new Date(event.date).toLocaleString()}\nLocation: ${event.location}\nBooking ID: ${booking._id}`,
                };

                await transporter.sendMail(mailOptions);
            }
        } catch (mailErr) {
            console.error('Email send failed:', mailErr?.message || mailErr);
        }

        res.json({
            success: true,
            message: 'Booking successful',
            booking,
            remainingSeats: event.totalSeats - event.bookedSeats,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getGuestBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('eventId');
        const payload = bookings.map(b => ({
            bookingId: b._id,
            event: b.eventId?.name || 'Unknown',
            seatsBooked: b.seatBooked,
            seatNumbers: b.seatNumbers,
            bookingTime: b.bookingDate
        }));
        res.json(payload);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
