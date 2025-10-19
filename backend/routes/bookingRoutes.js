const express = require("express");
const { bookSeats, getGuestBookings } = require("../controllers/bookingController.js");
const router = express.Router();

router.post("/book", bookSeats);
router.get("/guest", getGuestBookings);
module.exports = router;