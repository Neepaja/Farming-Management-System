import React, { useState } from 'react';
import axios from 'axios';
import './AddUser.css';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Admin', // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Send registration request to backend
      const response = await axios.post('http://localhost:3001/api/register', formData);

      // Handle success
      console.log('User registered successfully', response.data);

      // Store token in cookies
      document.cookie = `token=${response.data.token}; path=/`;

      // Clear form fields after successful registration
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Admin', // Reset role to default
      });
    } catch (error) {
      // Handle error
      console.error('Error registering user:', error.message);
    }
  };
  return (
    <div>
    <div className="register-form-container mt-3 flex-grow-1">
      <h2>Register User</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="Admin">Admin</option>
          <option value="CC">CC</option>
          <option value="SK">SK</option>
          <option value="Supervisor">Supervisor</option>
          <option value="FDO">FDO</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
    <div className="go-back-button" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
    <Link to="/dashboard" className="btn btn-secondary">Go Back</Link>
</div>
</div>
  );
};

export default RegisterForm;
