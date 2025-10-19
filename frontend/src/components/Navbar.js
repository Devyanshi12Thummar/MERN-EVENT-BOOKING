import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-blue-600 text-white shadow-md">
    <div className="container mx-auto flex justify-between items-center px-6 py-3">
      <Link to="/" className="font-bold text-xl">EventBooker</Link>
      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-200">Home</Link>
        <Link to="/my-bookings" className="hover:text-gray-200">My Bookings</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
