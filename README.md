# MERN Event Booking

Full‑stack event booking application built with the MERN stack. Users can browse events, view details, select specific seats, review and confirm bookings. The app supports real‑time seat updates via WebSockets and optional email confirmations.


## Tech Stack

- Frontend: React, React Router, Axios, Tailwind CSS, Socket.IO Client
- Backend: Node.js, Express, Mongoose, Socket.IO, Nodemailer, CORS, dotenv
- Database: MongoDB


## Project Structure

- backend/
  - server.js (Express app + Socket.IO)
  - config/
    - db.js (Mongo connection)
  - controllers/
    - eventController.js
    - bookingController.js
  - models/
    - Event.js
    - Booking.js
  - routes/
    - eventRoutes.js
    - bookingRoutes.js
  - seedEvents.js (seed sample events)
  - package.json
  - .env (environment variables)
- frontend/
  - public/
  - src/
    - components/
      - BookingForm.js (seat selection + review trigger)
      - BookingConfirmation.js
      - EventCard.js, Navbar.js, Footer.js
    - pages/
      - EventList.js (list events)
      - EventDetail.js (event details + seat map)
      - ConfirmBooking.js (review + submit booking)
      - MyBookings.js (list past bookings)
      - NotFound.js
    - services/
      - api.js (axios helpers – see API endpoints below)
    - App.js, index.js, styles
  - package.json
  - tailwind.config.js


## Features

- Browse events and view details
- Seat selection with visual seat map and selection count
- Review step before confirming the booking
- Real‑time seat updates using Socket.IO
  - Clients join an event room and receive "seatsUpdated" notifications
- Bookings list (guest view) with booking time
- Email confirmation (optional; requires SMTP configuration)


## Prerequisites

- Node.js 18+ and npm
- MongoDB running locally or a connection string to a hosted instance


## Environment Variables (Backend)

Create backend/.env (already present in this repo, update values to your own). Required keys:

- PORT: Server port (default 5000)
- MONGO_URI: MongoDB connection string
- SMTP_HOST: SMTP server hostname (optional; for email)
- SMTP_PORT: SMTP port (e.g., 465 or 587)
- SMTP_SECURE: true/false based on your SMTP
- SMTP_USER: SMTP username
- SMTP_PASS: SMTP password
- MAIL_FROM: From header, e.g. "Your Name <no-reply@example.com>"

Example:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern-event-booking
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
MAIL_FROM="Event Booker <no-reply@example.com>"


## Installation and Running

Open two terminals: one for backend, one for frontend.

1) Backend
- cd backend
- npm install
- Ensure MongoDB is running and backend/.env is configured
- Seed sample events (optional): node seedEvents.js
- Start the server: npm run dev
- The API will run at http://localhost:5000

2) Frontend
- cd frontend
- npm install
- Start the app: npm start
- Open http://localhost:3000 in the browser

CORS is configured to allow the frontend at http://localhost:3000.


## API Endpoints

Base URL (default): http://localhost:5000

Events
- GET /events
  - Returns list of all events
- GET /events/:id
  - Returns a single event along with a computed seats array: [{ id, label, status: 'available'|'booked' }]

Bookings
- POST /api/bookings/book
  - Body JSON:
    - userId: string (required)
    - eventId: string (required)
    - seats: number (required; total seats being booked)
    - seatNumbers: number[] (required; list of specific seat numbers)
    - email: string (optional but needed for email confirmation)
  - Response includes booking info and remainingSeats; also emits a seatsUpdated event to other clients in the same event room
- GET /api/bookings/guest
  - Returns a simplified list of past guest bookings


## Real‑time Events (Socket.IO)

Client connects to http://localhost:5000 and joins an event room:
- Emit: 'joinEvent' with eventId

Server emits on successful booking:
- Event: 'seatsUpdated'
- Payload: { eventId, bookedSeatsCount, newlyBooked: number[] }

The frontend listens for 'seatsUpdated' and updates the local seat map and selection accordingly.


## Scripts

Backend
- npm run dev – start server with nodemon

Frontend
- npm start – start CRA dev server
- npm run build – production build
- npm test – run tests


## Notes

- This demo has no authentication; userId is a free text field
- Email sending is best‑effort; booking will succeed even if email fails
- The src/services/api.js contains helper endpoints. In pages, some axios calls use explicit URLs (e.g., http://localhost:5000/events). Ensure BASE URLs match your environment if you refactor to use api.js centrally


## Troubleshooting

- MongoDB connection errors: verify MONGO_URI and that MongoDB is running
- CORS issues: ensure frontend runs at http://localhost:3000 or update backend CORS settings
- Port conflicts: change PORT in backend/.env or react-scripts port via environment variable


## License

ISC (see package.json).
