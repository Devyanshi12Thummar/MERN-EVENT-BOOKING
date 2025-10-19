import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getEvents = async () => (await axios.get(`${API_URL}/events`)).data;
export const getEventById = async (id) => (await axios.get(`${API_URL}/events/${id}`)).data;
export const bookSeats = async (payload) => (await axios.post(`${API_URL}/book`, payload)).data;
export const getUserBookings = async (userId) => (await axios.get(`${API_URL}/bookings/${userId}`)).data;
