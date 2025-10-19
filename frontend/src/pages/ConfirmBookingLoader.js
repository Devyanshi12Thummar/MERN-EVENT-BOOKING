import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmBooking from "./ConfirmBooking";

const ConfirmBookingLoader = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("bookingReview");
    if (!raw) {
      navigate("/", { replace: true });
      return;
    }
    try {
      setState(JSON.parse(raw));
    } catch {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  if (!state) return null;

  return <ConfirmBooking />;
};

export default ConfirmBookingLoader;
