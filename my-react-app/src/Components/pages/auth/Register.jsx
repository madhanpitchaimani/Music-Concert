import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Check if user already exists
      const res = await axios.get(`http://localhost:3000/users?email=${email}`);
      if (res.data.length > 0) {
        alert("User already exists");
        return;
      }

      // Add new user (role = user by default)
      await axios.post("http://localhost:3000/users", {
        username,
        email,
        password,
        role: "user"
      });

      alert("Registration successful");
      navigate('/login');
    } catch (err) {
      alert("Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Register for ConcertX</h2>

        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit" className="register-button">Register</button>
        <p className="register-toggle-text">Already have an account? <Link to="/login">Login here</Link></p>
      </form>
    </div>
  );
}

export default Register;
