
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("./models/Event");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const events = [
  { name: "Music Concert", date: new Date(), totalSeats: 50, location: "Hall A", description: "Live concert show" },
  { name: "Tech Conference", date: new Date(), totalSeats: 100, location: "Auditorium", description: "Tech talks" }
];

Event.insertMany(events)
  .then(() => {
    console.log(" Events added successfully!");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(" Error seeding data:", err);
    mongoose.connection.close();
  });