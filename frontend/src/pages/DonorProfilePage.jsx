import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';
import logo from '../images/f.png';

export default function DonorProfilePage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <div className="home-page d-flex flex-column min-vh-100">
      {/* Navbar */}
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand href="/donor-dashboard">
            <img src={logo} alt="Logo" height="50" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/donor-dashboard" className="nav-custom-link me-3">Home</Nav.Link>
              <Nav.Link as={Link} to="/add-donation" className="nav-custom-link me-3">Add Donation</Nav.Link>
              <Nav.Link as={Link} to="/mydonations" className="nav-custom-link me-3">My Donations</Nav.Link>
              <Nav.Link as={Link} to="/mywaste" className="nav-custom-link me-3">My Waste</Nav.Link>
              <Nav.Link as={Link} to="/profile" className="nav-custom-link me-3 active">Profile</Nav.Link>
              <Nav.Link onClick={handleLogout} className="nav-custom-link text-danger">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Profile Content */}
      <Container className="my-5 flex-grow-1">
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <Card className="shadow rounded-4">
              <Card.Body>
                <h2 className="mb-4 text-center">
                  <span className="highlighted-name" style={{ color: 'purple' }}>{fullName}</span>'s Profile
                </h2>
                <hr />
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>First Name:</strong> {user.first_name}</p>
                <p><strong>Last Name:</strong> {user.last_name}</p>
                <p><strong>Address:</strong> {user.address || 'Not provided'}</p>
                <p><strong>Birthday:</strong> {user.birthday || 'Not provided'}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="footer text-center py-3 mt-auto">
        <p className="mb-0">© 2025 FeedoLog. All rights reserved.</p>
      </footer>
    </div>
  );
}
