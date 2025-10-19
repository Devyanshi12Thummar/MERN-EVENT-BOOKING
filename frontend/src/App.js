import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EventList from "./pages/EventList";
import EventDetail from "./pages/EventDetail";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";
import ConfirmBooking from "./pages/ConfirmBooking";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/confirm-booking" element={<ConfirmBooking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
