import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/tracker.css'; // adjust the path based on your project structure

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'donor', // default role
    first_name: '',
    last_name: '',
    birthday: '',   // added birthday field
    address: ''     // added address field
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('api/register/', form);
      localStorage.setItem('token', res.data.token); // optional: store token if returned
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please check your inputs.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <input
        name="first_name"
        placeholder="First Name"
        value={form.first_name}
        onChange={handleChange}
        required
      />
      <input
        name="last_name"
        placeholder="Last Name"
        value={form.last_name}
        onChange={handleChange}
        required
      />
      <input
        name="birthday"
        type="date"
        placeholder="Birthday"
        value={form.birthday}
        onChange={handleChange}
        required
      />
      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <input
        name="confirm_password"
        type="password"
        placeholder="Confirm Password"
        value={form.confirm_password}
        onChange={handleChange}
        required
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        required
      >
        <option value="donor">Donor</option>
        <option value="organization">Organization</option>
      </select>

      <button type="submit">Register</button>
    </form>
  );
}
