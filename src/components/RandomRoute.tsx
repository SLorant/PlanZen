import React, { useEffect } from "react";
import axios from "axios";

const RandomRoute = () => {
  useEffect(() => {
    handleRegister();
  }, []);

  const handleRegister = async () => {
    try {
      const response = await axios.get("http://localhost:4000/protected-route", {
        withCredentials: true,
      });
      console.log(response.data);
      // You can handle success here, like redirecting to another page
    } catch (error) {
      console.log(error);
    }
  };

  return <div>RandomRoute</div>;
};

export default RandomRoute;
