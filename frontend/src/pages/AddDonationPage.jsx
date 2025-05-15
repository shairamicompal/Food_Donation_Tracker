import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Navbar, Nav, Row, Col, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/Homepage.css';
import logo from '../images/f.png';

export default function AddDonationPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [organizations, setOrganizations] = useState([]);

    const [formData, setFormData] = useState({
        food_type: '',
        quantity: '',
        expiration_date: '',
        pickup_option: '',
        donation_type: 'donate',
        organization: '',
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
    }, []);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const res = await API.get('/organizations/');
                setOrganizations(res.data);
            } catch (err) {
                console.error('Failed to load organizations', err);
            }
        };
        fetchOrganizations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'organization') {
            setFormData({ ...formData, [name]: value ? parseInt(value) : '' });
        } else if (name === 'donation_type') {
            setFormData((prev) => ({
                ...prev,
                donation_type: value,
                expiration_date: value === 'waste' ? '' : prev.expiration_date,
                pickup_option: value === 'waste' ? '' : prev.pickup_option,
                organization: value === 'waste' ? '' : prev.organization,
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to submit a donation.');
                navigate('/login');
                return;
            }

            // Clean formData before sending:
            const submissionData = { ...formData };

            if (submissionData.donation_type === 'waste') {
                // Set donation_type 'waste' fields to null (not empty string)
                submissionData.organization = null;
                submissionData.expiration_date = null;
                submissionData.pickup_option = null;
            }

            // Convert any other empty strings to null for safe backend handling
            Object.keys(submissionData).forEach(key => {
                if (submissionData[key] === '') {
                    submissionData[key] = null;
                }
            });

            console.log('Submitting cleaned data:', submissionData);

            await API.post('donations/', submissionData, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            setFormData({
                food_type: '',
                quantity: '',
                expiration_date: '',
                pickup_option: '',
                donation_type: 'donate',
                organization: '',
            });

            navigate(formData.donation_type === 'donate' ? '/mydonations' : '/mywaste');
        } catch (error) {
            console.error('Error submitting donation:', error);
            alert('Failed to submit donation.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div className="home-page d-flex flex-column min-vh-100">
            <Navbar expand="lg" className="navbar">
                <Container>
                    <Navbar.Brand as={Link} to="/donor-dashboard">
                        <img src={logo} alt="Logo" height="50" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/donor-dashboard" className="nav-custom-link me-3">Home</Nav.Link>
                            <Nav.Link as={Link} to="/add-donation" className="nav-custom-link me-3 active">Add Donation</Nav.Link>
                            <Nav.Link as={Link} to="/mydonations" className="nav-custom-link me-3">My Donations</Nav.Link>
                            <Nav.Link as={Link} to="/mywaste" className="nav-custom-link me-3">My Waste</Nav.Link>
                            <Nav.Link as={Link} to="/profile" className="nav-custom-link me-3">Profile</Nav.Link>
                            <Nav.Link onClick={handleLogout} className="nav-custom-link text-danger">Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">
                <Row className="justify-content-center">
                    <Col xs={12} md={8}>
                        <h1 className="mb-4 text-center">Add Donation</h1>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Donation Type</Form.Label>
                                <Form.Select
                                    name="donation_type"
                                    value={formData.donation_type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="donate">Donate</option>
                                    <option value="waste">Waste</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Food Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="food_type"
                                    value={formData.food_type}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            {formData.donation_type === 'donate' && (
                                <>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Expiration Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="expiration_date"
                                            value={formData.expiration_date}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Pickup Option</Form.Label>
                                        <Form.Select
                                            name="pickup_option"
                                            value={formData.pickup_option}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select</option>
                                            <option value="self_delivery">Self Delivery</option>
                                            <option value="request_pickup">Request Pickup</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Select Organization</Form.Label>
                                        <Form.Select
                                            name="organization"
                                            value={formData.organization}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">-- Select an Organization --</option>
                                            {organizations.map((org) => (
                                                <option key={org.id} value={org.id}>
                                                    {org.name} - {org.address}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </>
                            )}

                            <div className="text-center">
                                <Button
                                    type="submit"
                                    className="purple-btn w-50 rounded-pill"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        formData.donation_type === 'donate' ? 'Submit Donation' : 'Submit Waste'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>

            <footer className="footer text-center py-3 mt-auto">
                <p className="mb-0">© 2025 FeedoLog. All rights reserved.</p>
            </footer>
        </div>
    );
}
