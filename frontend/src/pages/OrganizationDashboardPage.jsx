import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';
import logo from '../images/f.png';

export default function OrganizationDashboardPage() {
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
    localStorage.removeItem('address');
    localStorage.removeItem('birthday');
    navigate('/login');
  };

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <div className="home-page d-flex flex-column min-vh-100">
      {/* Navbar */}
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand href="/organization-dashboard">
            <img src={logo} alt="Logo" height="50" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="#" className="nav-custom-link me-3 active">Home</Nav.Link>
              <Nav.Link as={Link} to="/organization-donations" className="nav-custom-link me-3">Incoming Donations</Nav.Link>
              <Nav.Link as={Link} to="/organization-profile" className="nav-custom-link me-3">Profile</Nav.Link>
              <Nav.Link onClick={handleLogout} className="nav-custom-link text-danger">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Dashboard Content */}
      <Container className="my-5 flex-grow-1">
        <Row className="justify-content-center">
          <Col xs={12} md={8} className="text-center">
            <h1 className="mb-4">
              Welcome, <span className="highlighted-name">{fullName}</span>! <span role="img" aria-label="waving hand">🤝</span>
            </h1>

            <p className="lead">Here you can:</p>
            <ul className="text-start mx-auto" style={{ maxWidth: '500px' }}>
              <li>📦 View and manage incoming donations</li>
              <li>📍 Connect with local donors</li>
              <li>🛠️ Update your organization's profile</li>
              <li>📊 Generate reports on received donations</li>
            </ul>
            <p className="mt-4">Together, we fight food waste! 🌍</p>
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
