// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API, { setAuthToken } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col, Navbar, Nav, InputGroup } from 'react-bootstrap';
import '../styles/Homepage.css';
import logo from '../images/logs.png';
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg(''); // Clear previous success message

    if (!form.username || !form.password) {
      setErrorMsg('Please enter both email/username and password.');
      return;
    }

    try {
      const res = await API.post('login/', form);
      const { token, role, user, address, birthday } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ ...user, role, address, birthday }));

      setAuthToken(token);

      setSuccessMsg('Login successful! Redirecting...');

      setTimeout(() => {
        if (role === 'donor') {
          navigate('/donor-dashboard');
        } else if (role === 'organization') {
          navigate('/organization-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setErrorMsg('Invalid email/username or password. Please try again.');
      } else {
        setErrorMsg('Login failed. Please try again later.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="home-page d-flex flex-column min-vh-100">
      {/* Navbar */}
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src={logo} alt="Logo" height="50" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login" className="nav-custom-link me-3">Login</Nav.Link>
              <Nav.Link as={Link} to="/register" className="nav-custom-link">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container fluid className="login-wrapper d-flex">
        <Row className="flex-grow-1 w-100">
          {/* Left Side */}
          <Col md={8} className="login-left d-none d-md-flex align-items-center justify-content-center">
            {/* Optional left-side content */}
          </Col>

          {/* Right Side */}
          <Col xs={12} md={4} className="d-flex align-items-center justify-content-center login-right">
            <div className="login-form-wrapper text-center">
              <img src={logo} alt="Logo" className="login-logo mb-3" />
              <h3 className="mb-4">Log in</h3>

              <Form onSubmit={handleSubmit} noValidate>
                {/* Email or Username Field */}
                <Form.Group className="mb-3 text-start" controlId="formUsername">
                  <Form.Label>Email/Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter your email or username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      className="px-3 py-2"
                    />
                  </InputGroup>
                </Form.Group>

                {/* Password Field with Toggle */}
                <Form.Group className="mb-4 text-start" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <InputGroup>
                      <InputGroup.Text>
                        <FaLock />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="px-3 py-2 pe-5"
                      />
                    </InputGroup>
                    <span
                      className="toggle-password-icon"
                      onClick={togglePasswordVisibility}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: '15px',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer'
                      }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </Form.Group>

                {/* Success message */}
                {successMsg && (
                  <div className="alert alert-success text-start" role="alert" style={{ marginBottom: '1rem' }}>
                    {successMsg}
                  </div>
                )}

                {/* Error message */}
                {errorMsg && (
                  <div className="alert alert-danger text-start" role="alert" style={{ marginBottom: '1rem' }}>
                    {errorMsg}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 rounded-pill py-2 mb-3 d-flex align-items-center justify-content-center gap-2"
                >
                  <FaSignInAlt />
                  Login
                </Button>
              </Form>

              {/* Register Link */}
              <div className="register-link">
                <span>Don't have an account? </span>
                <Link to="/register" className="text-decoration-underline text-primary fw-semibold">
                  Click here to Register
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="footer text-center py-3 mt-auto">
        <p className="mb-0">© 2025 FeedoLogs. All rights reserved.</p>
      </footer>
    </div>
  );
}
