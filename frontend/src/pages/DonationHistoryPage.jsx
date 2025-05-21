import React, { useEffect, useState } from 'react';
import { Container, Button, Spinner, Navbar, Nav, Row, Col, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/Homepage.css';
import logo from '../images/f.png';

export default function DonationHistoryPage() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('accepted'); // 'accepted' or 'declined'

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Fetch donations with statuses accepted or declined
      const response = await API.get('donations/received/', {
        headers: { Authorization: `Token ${token}` },
      });
      // Filter to only accepted or declined donations here on frontend
      const filteredDonations = response.data.filter(d =>
        d.status === 'accepted' || d.status === 'declined'
      );
      setDonations(filteredDonations);
    } catch (error) {
      console.error('Error fetching donation history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(d => d.status === filter);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user || loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="home-page d-flex flex-column min-vh-100">
      {/* Navbar */}
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand as={Link} to="/organization-dashboard">
            <img src={logo} alt="Logo" height="50" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/organization-dashboard" className="nav-custom-link me-3">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/received-donations" className="nav-custom-link me-3">
                Received Donations
              </Nav.Link>
              <Nav.Link as={Link} to="/donation-history" className="nav-custom-link me-3 active">
                Donation History
              </Nav.Link>
              <Nav.Link as={Link} to="/organization-profile" className="nav-custom-link me-3">
                Profile
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="nav-custom-link text-danger">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Filter Buttons */}
      <Container className="my-4">
        <h1 className="mb-4 text-center mt-4">📜 Donation History</h1>
        <Row className="justify-content-center">
          <Col xs="auto">
            <Button
              variant={filter === 'accepted' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('accepted')}
              className="me-2"
            >
              Accepted
            </Button>
            <Button
              variant={filter === 'declined' ? 'primary' : 'outline-primary'}
              onClick={() => setFilter('declined')}
            >
              Declined
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Donation Table */}
      <Container className="flex-grow-1 mb-5">
        {filteredDonations.length === 0 ? (
          <div className="text-center mt-5">
            <p>No {filter} donations found.</p>
            <Button onClick={() => navigate('/organization-dashboard')} className="purple-btn rounded-pill">
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover className="mt-4 text-start">
              <thead>
                <tr>
                  <th>Food Type</th>
                  <th>Quantity</th>
                  <th>Expiration Date</th>
                  <th>Pickup Option</th>
                  <th>Donor</th>
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map(donation => (
                  <tr key={donation.id}>
                    <td>{donation.food_type}</td>
                    <td>{donation.quantity}</td>
                    <td>{donation.expiration_date ? new Date(donation.expiration_date).toLocaleDateString() : 'N/A'}</td>
                    <td>{donation.pickup_option || 'N/A'}</td>
                    <td>
                      {donation.donor_details ? (
                        <>
                          <strong>
                            {donation.donor_details.first_name || ''} {donation.donor_details.last_name || ''}
                          </strong>
                          <br />
                          <small>{donation.donor_details.address || 'No address provided'}</small>
                          <br />
                          <small className="text-muted">{donation.donor_details.email || 'No email provided'}</small>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>{new Date(donation.created_at).toLocaleString()}</td>
                    <td>{donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>

      {/* Footer */}
      <footer className="footer text-center py-3 mt-auto">
        <p className="mb-0">© 2025 FeedoLog. All rights reserved.</p>
      </footer>
    </div>
  );
}
