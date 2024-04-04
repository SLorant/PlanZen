import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/register",
        {
          username,
          email,
          password,
          birthdate,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      // You can handle success here, like redirecting to another page
    } catch (error) {
      console.log(error);
      setError(error?.response?.data);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <br />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <input type="date" placeholder="Birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
