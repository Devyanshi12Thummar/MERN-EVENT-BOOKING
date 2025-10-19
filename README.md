 MERN Event Booking

A full-stack **Event Booking Application** built with the **MERN** stack — **MongoDB, Express, React, and Node.js**.  
This app allows users to browse, view details, and book events seamlessly, with a secure backend and dynamic frontend.

---

##  Features

✅ User-friendly React frontend (event listing, booking form, confirmation page)  
✅ RESTful Express + Node.js backend  
✅ MongoDB database with Mongoose models for `Event` and `Booking`  
✅ Secure API with environment variables  
✅ Form validation and error handling  
✅ Modular folder structure for scalability  

---

##  Tech Stack

**Frontend:** React, Axios, React Router, Bootstrap / Tailwind  
**Backend:** Node.js, Express.js, Mongoose, JWT (optional for auth)  
**Database:** MongoDB Atlas  
**Tools:** Nodemon, dotenv, concurrently (for development)

---

##  Project Structure

mern-event-booking/
├── backend/
│ ├── config/ # DB connection and environment setup
│ ├── controllers/ # Logic for event & booking routes
│ ├── models/ # Mongoose schemas (Event, Booking)
│ ├── routes/ # Express route definitions
│ ├── server.js # Main server entry point
│ ├── .env # Environment variables (DO NOT COMMIT)
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Event list, event details, booking form
│ │ ├── services/ # API calls (Axios)
│ │ └── App.js
│ ├── public/
│ └── package.json
│
├── .gitignore
├── README.md

1️⃣ Clone the repository
```bash
git clone https://github.com/Devyanshi12Thummar/mern-event-booking.git
cd mern-event-booking

2️⃣ Install dependencies
# Backend dependencies
cd backend
npm install
node seedEvents.js
npm --prefix backend install socket.io //socket.io
npm --prefix backend install nodemailer //mail

# Frontend dependencies
cd ../frontend
npm install
npm --prefix frontend install socket.io-client //socket.io client

3️⃣ Create .env file inside backend/

Create a file named .env with the following variables:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern-event-booking
SMTP_HOST=smtp.gmail.com 
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=devanshithummar123@gmail.com
SMTP_PASS=qlqiloqaehtavcxq
MAIL_FROM="event Author <devanshithummar123@gmail.com>"

▶️ Run the App
Run backend (Node/Express)
cd backend
npm run dev

Run frontend (React)
cd frontend
npm start


Run both together
If using concurrently:
npm run dev

API Endpoints (Example)
| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | `/api/events`     | Get all events           |
| GET    | `/api/events/:id` | Get single event by ID   |
| POST   | `/api/bookings/book`| Create a new booking     |
| GET    | `/api/bookings/guest`| Get all bookings (admin) |

Scripts
Backend
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}


Frontend
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test"
}


Sample Data for Event Collection
[
  {
    "name": "Tech Innovators Conference 2025",
    "date": "2025-11-15T09:00:00Z",
    "totalSeats": 200,
    "bookedSeats": 50,
    "location": "Ahmedabad, Gujarat",
    "description": "A conference for tech leaders and innovators discussing AI, IoT, and the future of technology."
  }
]

Sample Data for Booking Collection
[
  {
    "userId": "user_001",
    "email": "raj.patel@example.com",
    "eventId": "670f9a1c1234567890abcdef", 
    "seatBooked": 2,
    "seatNumbers": [15, 16],
    "bookingDate": "2025-10-18T08:00:00Z"
  }
]
