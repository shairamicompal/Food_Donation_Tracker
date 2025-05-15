import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Navbar, Nav, Row, Col, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/Homepage.css';
import logo from '../images/f.png';

export default function MyWastePage() {
    const navigate = useNavigate();
    const [wasteItems, setWasteItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [deletingWasteId, setDeletingWasteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);

        fetchWaste();
    }, []);

    const fetchWaste = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await API.get('donations/mine/', {
                headers: { Authorization: `Token ${token}` },
            });
            const wasteOnly = response.data.filter(item => item.donation_type === 'waste');
            setWasteItems(wasteOnly);
        } catch (error) {
            console.error('Error fetching waste items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const confirmDelete = (wasteId) => {
        setDeletingWasteId(wasteId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await API.delete(`donations/${deletingWasteId}/delete/`, {
                headers: { Authorization: `Token ${token}` },
            });
            setWasteItems(wasteItems.filter(w => w.id !== deletingWasteId));
            setShowDeleteModal(false);
            setDeletingWasteId(null);
        } catch (error) {
            console.error('Error deleting waste item:', error);
            setShowDeleteModal(false);
            setDeletingWasteId(null);
        }
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
            <Navbar expand="lg" className="navbar">
                <Container>
                    <Navbar.Brand as={Link} to="/donor-dashboard">
                        <img src={logo} alt="Logo" height="50" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/donor-dashboard" className="nav-custom-link me-3">Home</Nav.Link>
                            <Nav.Link as={Link} to="/add-donation" className="nav-custom-link me-3">Add Donation</Nav.Link>
                            <Nav.Link as={Link} to="/mydonations" className="nav-custom-link me-3">My Donations</Nav.Link>
                            <Nav.Link as={Link} to="/mywaste" className="nav-custom-link me-3 active">My Waste</Nav.Link>
                            <Nav.Link as={Link} to="/profile" className="nav-custom-link me-3">Profile</Nav.Link>
                            <Nav.Link onClick={handleLogout} className="nav-custom-link text-danger">Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <h1 className="mb-4 text-center">🗑️ My Waste</h1>

                        {wasteItems.length === 0 ? (
                            <div className="text-center">
                                <p className="mb-4">You haven't recorded any waste yet.</p>
                                <Button onClick={() => navigate('/donor-dashboard')} variant="secondary rounded-pill">
                                    Back to Dashboard
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <Table striped bordered hover className="mt-4 text-start">
                                        <thead>
                                            <tr>
                                                <th>Food Type</th>
                                                <th>Quantity</th>
                                                <th>Created At</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wasteItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.food_type}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{new Date(item.created_at).toLocaleString()}</td>
                                                    <td>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => confirmDelete(item.id)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>

                                <div className="text-center mt-4">
                                    <Button onClick={() => navigate('/donor-dashboard')} className="purple-btn rounded-pill">
                                        Back to Dashboard
                                    </Button>
                                </div>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this waste record?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>

            <footer className="footer text-center py-3 mt-auto">
                <p className="mb-0">© 2025 FeedoLog. All rights reserved.</p>
            </footer>
        </div>
    );
}
