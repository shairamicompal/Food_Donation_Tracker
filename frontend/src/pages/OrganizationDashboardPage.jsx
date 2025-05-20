import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API, { setAuthToken } from '../services/api';  // Assuming same API utils
import '../styles/Homepage.css';
import logo from '../images/f.png';

export default function OrganizationDashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null); // To hold pending, accepted, declined counts
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedToken = localStorage.getItem('token');

    if (!storedUser || !storedToken) {
      navigate('/login');
      return;
    }

    setUser(storedUser);
    setAuthToken(storedToken);
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      // Replace these API endpoints with your backend ones that return these stats for organization
      const res = await API.get('donations/org-stats/'); 
      // Expected response format example:
      // { pending: 4, accepted: 3, declined: 3 }
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching organization dashboard stats:', error);
      setStats({ pending: 0, accepted: 0, declined: 0 });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Calculate overall dynamically by summing other stats
  const overall = (stats?.pending ?? 0) + (stats?.accepted ?? 0) + (stats?.declined ?? 0);

  const fullName = `${user.first_name} ${user.last_name}`;

  const chartData = stats ? [
    { name: 'Overall', value: overall },
    { name: 'Pending', value: stats.pending ?? 0 },
    { name: 'Accepted', value: stats.accepted ?? 0 },
    { name: 'Declined', value: stats.declined ?? 0 },
  ] : [];

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
              <Nav.Link as={Link} to="/received-donations" className="nav-custom-link me-3">Incoming Donations</Nav.Link>
              <Nav.Link as={Link} to="/donation-history" className="nav-custom-link me-3">Donation History</Nav.Link>
              <Nav.Link as={Link} to="/organization-profile" className="nav-custom-link me-3">Profile</Nav.Link>
              <Nav.Link onClick={handleLogout} className="nav-custom-link text-danger">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="my-5 flex-grow-1">
        <Row className="justify-content-center mb-4">
          <Col xs="auto" className="text-center">
            <h1>
              Welcome, <span className="highlighted-name">{fullName}</span>! <span role="img" aria-label="handshake">🤝</span>
            </h1>
            <p className="lead">Here’s a quick overview of your donation management:</p>
          </Col>
        </Row>

        <Row className="align-items-center g-4 flex-lg-row">
          {/* Left Content */}
          <Col lg={5}>
            <p className="lead mb-4">On your dashboard, you can:</p>
            <ul className="fs-5">
              <li>📦 Manage incoming donations</li>
              <li>📍 Connect with donors in your area</li>
              <li>🛠️ Update your organization’s profile details</li>
              <li>📊 Generate reports on donations received</li>
            </ul>
          </Col>

          {/* Right Card + Chart */}
          <Col lg={7}>
            <Card className="shadow-lg p-4 rounded-4 text-center mb-4 border-10">
              <Card.Title className="fs-4 mb-3">📊 Donation Stats</Card.Title>
              <Row>
                <Col xs={6}>
                  <h5 className="text-muted">📦 Overall</h5>
                  <h2>{stats ? overall : <Spinner animation="border" size="sm" />}</h2>
                </Col>
                <Col xs={6}>
                  <h5 className="text-muted">⏳ Pending</h5>
                  <h2>{stats ? stats.pending : <Spinner animation="border" size="sm" />}</h2>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col xs={6}>
                  <h5 className="text-muted">✅ Accepted</h5>
                  <h2>{stats ? stats.accepted : <Spinner animation="border" size="sm" />}</h2>
                </Col>
                <Col xs={6}>
                  <h5 className="text-muted">❌ Declined</h5>
                  <h2>{stats ? stats.declined : <Spinner animation="border" size="sm" />}</h2>
                </Col>
              </Row>
              <div className="mt-4" style={{ height: '150px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={90} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#640269" radius={[0, 10, 10, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
