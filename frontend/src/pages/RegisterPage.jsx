
// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API, { setAuthToken } from '../services/api'; // ✅ Import setAuthToken
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col, Navbar, Nav, InputGroup } from 'react-bootstrap';
import '../styles/Homepage.css';
import logo from '../images/logs.png';
import { FaUserPlus, FaUser, FaIdBadge, FaBirthdayCake, FaMapMarkerAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'donor',
    first_name: '',
    last_name: '',
    birthday: '',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear old errors

    if (!form.confirm_password) {
      setErrors({ confirm_password: "Please confirm your password" });
      return;
    }

    if (form.password !== form.confirm_password) {
      setErrors({ confirm_password: "Passwords do not match" });
      return;
    }

    try {
      let formData = { ...form };

      if (formData.role === 'organization') {
        delete formData.birthday;
      }

      const res = await API.post('register/', formData); // ✅ Correct endpoint

      const { token, user, role, address, birthday } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        role,
        address,
        birthday
      }));

      setAuthToken(token); // ✅ Set token globally

      if (role === 'donor') {
        navigate('/donor-dashboard');
      } else if (role === 'organization') {
        navigate('/organization-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        alert('Registration failed. Please try again.');
      }
    }
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
          <Col md={8} className="login-left d-none d-md-flex align-items-center justify-content-center" />

          <Col xs={12} md={4} className="d-flex align-items-center justify-content-center login-right">
            <div className="login-form-wrapper text-center">
              <img src={logo} alt="Logo" className="login-logo mb-3" />
              <h3 className="mb-4">Registration</h3>
              <Form onSubmit={handleSubmit}>

                {/* Role Selection */}
                <Form.Group className="mb-4 text-start">
                  <Form.Label>Role</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaUser /></InputGroup.Text>
                    <Form.Select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="donor">Donor</option>
                      <option value="organization">Organization</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>

                {/* Username */}
                <Form.Group className="mb-3 text-start">
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaUser /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Enter your username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Full Name or Organization Name */}
                <Form.Group className="mb-3 text-start">
                  <Form.Label>{form.role === 'organization' ? "Organization Name" : "Full Name"}</Form.Label>
                  <InputGroup className="mb-2">
                    <InputGroup.Text><FaIdBadge /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="first_name"
                      placeholder={form.role === 'organization' ? "Organization Name" : "First Name"}
                      value={form.first_name}
                      onChange={handleChange}
                      required
                      isInvalid={!!errors.first_name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
                  </InputGroup>

                  {form.role === 'donor' && (
                    <InputGroup>
                      <InputGroup.Text><FaIdBadge /></InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={form.last_name}
                        onChange={handleChange}
                        required
                        isInvalid={!!errors.last_name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
                    </InputGroup>
                  )}
                </Form.Group>

                {/* Birthday */}
                {form.role === 'donor' && (
                  <Form.Group className="mb-3 text-start">
                    <Form.Label>Birthday</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FaBirthdayCake /></InputGroup.Text>
                      <Form.Control
                        type="date"
                        name="birthday"
                        value={form.birthday}
                        onChange={handleChange}
                        required
                        isInvalid={!!errors.birthday}
                      />
                      <Form.Control.Feedback type="invalid">{errors.birthday}</Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                )}

                {/* Address */}
                <Form.Group className="mb-3 text-start">
                  <Form.Label>Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaMapMarkerAlt /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Enter your address"
                      value={form.address}
                      onChange={handleChange}
                      isInvalid={!!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3 text-start">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3 text-start">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative mb-3">
                    <InputGroup>
                      <InputGroup.Text><FaLock /></InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="pe-5"
                        isInvalid={!!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    </InputGroup>
                    <span
                      className="toggle-password-icon"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>

                  {/* Confirm Password */}
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="position-relative">
                    <InputGroup>
                      <InputGroup.Text><FaLock /></InputGroup.Text>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        placeholder="Confirm Password"
                        value={form.confirm_password}
                        onChange={handleChange}
                        className="pe-5"
                        isInvalid={!!errors.confirm_password}
                      />
                      <Form.Control.Feedback type="invalid">{errors.confirm_password}</Form.Control.Feedback>
                    </InputGroup>
                    <span
                      className="toggle-password-icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: 'absolute', top: '50%', right: '15px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </Form.Group>

                {/* Submit Button */}
                <Button type="submit" className="w-100 rounded-pill">
                  <FaUserPlus className="me-2" /> Register
                </Button>

                {/* Link to Login */}
                <div className="register-link mt-3">
                  <span>Already have an account? </span>
                  <Link
                    to="/login"
                    className="text-decoration-underline text-primary fw-semibold"
                  >
                    Click here to Login
                  </Link>
                </div>

              </Form>
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
