import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API, { setAuthToken } from '../services/api';
import '../styles/Homepage.css';
import logo from '../images/f.png';

export default function DonorDashboardPage() {
  const [user, setUser] = useState(null);
  const [donationCount, setDonationCount] = useState(null);
  const [wasteCount, setWasteCount] = useState(null);
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
      const [donationRes, wasteRes] = await Promise.all([
        API.get('donations/my-count/'),
        API.get('waste/my-count/'),
      ]);
      setDonationCount(donationRes.data?.total ?? 0);
      setWasteCount(wasteRes.data?.total_waste ?? 0);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setDonationCount(0);
      setWasteCount(0);
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

  const fullName = `${user.first_name} ${user.last_name}`;
  const chartData = [
    { name: 'Donations', value: donationCount || 0 },
    { name: 'Waste', value: wasteCount || 0 },
  ];

  return (
    <div className="home-page d-flex flex-column min-vh-100">
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand href="/donor-dashboard">
            <img src={logo} alt="Logo" height="50" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="#" className="nav-custom-link me-3 active">Home</Nav.Link>
              <Nav.Link as={Link} to="/add-donation" className="nav-custom-link me-3">Add Donation</Nav.Link>
              <Nav.Link as={Link} to="/mydonations" className="nav-custom-link me-3">My Donations</Nav.Link>
              <Nav.Link as={Link} to="/mywaste" className="nav-custom-link me-3">My Waste</Nav.Link>
              <Nav.Link as={Link} to="/profile" className="nav-custom-link me-3">Profile</Nav.Link>
              <Nav.Link onClick={handleLogout} className="nav-custom-link text-danger">Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-5 flex-grow-1">
        {/* Welcome message row */}
        <Row className="justify-content-center mb-4">
          <Col xs="auto" className="text-center">
            <h1>
              Welcome, <span className="highlighted-name">{fullName}</span>! 👋
            </h1>
            <p className="lead"><p className="lead">Your generosity is changing lives. Check out the impact of your donations.</p>
            </p>
          </Col>
        </Row>

        <Row className="align-items-center g-4 flex-lg-row">
          {/* Left Content */}
          <Col lg={4}>
            <p className="lead mb-4">Here's your donation summary:</p>
            <ul className="fs-5">
              <li>📝 Log your surplus food donations</li>
              <li>📊 Track your donation and waste history</li>
              <li>📍 Find and donate to local organizations</li>
              <li>🧾 Generate impact reports</li>
            </ul>
          </Col>

          {/* Right Card + Chart */}
          <Col lg={8}>
            <Card className="shadow-lg p-4 rounded-4 text-center mb-4 border-10">
              <Card.Title className="fs-4 mb-3">📊 Your Stats</Card.Title>
              <Row>
                <Col xs={6}>
                  <h5 className="text-muted">🥫 Donations</h5>
                  <h2>{donationCount ?? <Spinner animation="border" size="sm" />}</h2>
                </Col>
                <Col xs={6}>
                  <h5 className="text-muted">🗑️ Waste</h5>
                  <h2>{wasteCount ?? <Spinner animation="border" size="sm" />}</h2>
                </Col>
              </Row>
              <div className="mt-4" style={{ height: '120px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
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

      <footer className="footer text-center py-3 mt-auto">
        <p className="mb-0">© 2025 FeedoLog. All rights reserved.</p>
      </footer>
    </div>
  );
}
