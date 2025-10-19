const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.use("/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
app.set('io', io);

io.on('connection', (socket) => {
  socket.on('joinEvent', (eventId) => {
    if (eventId) {
      socket.join(`event:${eventId}`);
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
