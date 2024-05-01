import React, { useEffect, useState } from "react";
import axios from "axios";

const RandomRoute = () => {
  const [error, setError] = useState("");
  useEffect(() => {
    handleRegister();
  }, []);

  const handleRegister = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_LIVE_SERVER}/protected-route`, {
        withCredentials: false,
      });
      console.log(response.data);
    } catch (error) {
      setError(error?.response?.data);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_LIVE_SERVER}`, {
        withCredentials: false,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      RandomRoute
      <button onClick={handleLogout}>Logout</button>
      {error && error}
    </div>
  );
};

export default RandomRoute;
