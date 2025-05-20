import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Navbar, Nav, Row, Col, Modal, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/Homepage.css';
import logo from '../images/f.png';

export default function MyDonationsPage() {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [deletingDonationId, setDeletingDonationId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDonation, setEditingDonation] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await API.get('donations/mine/', {
                headers: { Authorization: `Token ${token}` },
            });
            const filteredDonations = response.data.filter(item => item.donation_type !== 'waste');
            setDonations(filteredDonations);
        } catch (error) {
            console.error('Error fetching donations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const confirmDelete = (donationId) => {
        setDeletingDonationId(donationId);
        setShowDeleteModal(true);
    };

  const handleDelete = async () => {
    try {
        const token = localStorage.getItem('token');
        await API.delete(`donations/${deletingDonationId}/delete/`, {
            headers: { Authorization: `Token ${token}` },
        });
        setDonations(donations.filter(d => d.id !== deletingDonationId));
        setShowDeleteModal(false);
        setDeletingDonationId(null);
    } catch (error) {
        console.error('Error deleting donation:', error);
        // If backend returns a message, display it in an alert
        if (error.response && error.response.data.detail) {
            alert(error.response.data.detail);
        } else {
            alert('Failed to delete donation.');
        }
        setShowDeleteModal(false);
        setDeletingDonationId(null);
    }
};


    const openEditModal = (donation) => {
        setEditingDonation({ ...donation });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingDonation(prev => ({ ...prev, [name]: value }));
    };

    const submitEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await API.put(`donations/${editingDonation.id}/update/`, editingDonation, {
                headers: { Authorization: `Token ${token}` },
            });
            setDonations(prev =>
                prev.map(d => (d.id === editingDonation.id ? response.data : d))
            );
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating donation:', error);
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
                            <Nav.Link as={Link} to="/mydonations" className="nav-custom-link me-3 active">My Donations</Nav.Link>
                            <Nav.Link as={Link} to="/mywaste" className="nav-custom-link me-3">My Waste</Nav.Link>
                            <Nav.Link as={Link} to="/profile" className="nav-custom-link me-3">Profile</Nav.Link>
                            <Nav.Link onClick={handleLogout} className="nav-custom-link text-danger">Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="my-5 flex-grow-1">
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <h1 className="mb-4 text-center">📋 My Donations</h1>

                        {donations.length === 0 ? (
                            <div className="text-center">
                                <p className="mb-4">You haven't added any donations yet.</p>
                                <Button onClick={() => navigate('/donor-dashboard')} className="purple-btn rounded-pill">
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
                                                <th>Expiration Date</th>
                                                <th>Donation Type</th>
                                                <th>Pickup Option</th>
                                                <th>Organization</th>
                                                <th>Created At</th>
                                                <th>Status</th>
                                                <th>Notes</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {donations.map((donation) => {
                                                const isEditable = donation.status === 'pending';
                                                const isDeletable = donation.status === 'pending' || donation.status === 'declined';

                                                return (
                                                    <tr key={donation.id}>
                                                        <td>{donation.food_type}</td>
                                                        <td>{donation.quantity}</td>
                                                        <td>{donation.expiration_date}</td>
                                                        <td>{donation.donation_type}</td>
                                                        <td>{donation.pickup_option || 'N/A'}</td>
                                                        <td>
                                                            {donation.organization_details ? (
                                                                <>
                                                                    <strong>{donation.organization_details.name || 'N/A'}</strong><br />
                                                                    <small>{donation.organization_details.address || 'No address provided'}</small>
                                                                </>
                                                            ) : 'N/A'}
                                                        </td>
                                                        <td>{new Date(donation.created_at).toLocaleString()}</td>
                                                        <td>{donation.status ? donation.status.charAt(0).toUpperCase() + donation.status.slice(1) : 'N/A'}</td>
                                                        <td>{donation.notes !== null && donation.notes !== '' ? donation.notes : '-'}</td>
                                                        <td style={{ minWidth: '130px', verticalAlign: 'middle' }}>
                                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                                {/* Edit Button with Tooltip */}
                                                                {!isEditable ? (
                                                                    <OverlayTrigger overlay={<Tooltip>Cannot edit unless pending</Tooltip>}>
                                                                        <span className="d-inline-block">
                                                                            <Button
                                                                                variant="warning"
                                                                                size="sm"
                                                                                style={{ minWidth: '60px' }}
                                                                                disabled
                                                                            >
                                                                                Edit
                                                                            </Button>
                                                                        </span>
                                                                    </OverlayTrigger>
                                                                ) : (
                                                                    <span className="d-inline-block">
                                                                        <Button
                                                                            variant="warning"
                                                                            size="sm"
                                                                            style={{ minWidth: '60px' }}
                                                                            onClick={() => openEditModal(donation)}
                                                                        >
                                                                            Edit
                                                                        </Button>
                                                                    </span>
                                                                )}

                                                                {/* Delete Button with Tooltip */}
                                                                {!isDeletable ? (
                                                                    <OverlayTrigger overlay={<Tooltip>Cannot delete unless pending or declined</Tooltip>}>
                                                                        <span className="d-inline-block">
                                                                            <Button
                                                                                variant="danger"
                                                                                size="sm"
                                                                                style={{ minWidth: '60px' }}
                                                                                disabled
                                                                            >
                                                                                Delete
                                                                            </Button>
                                                                        </span>
                                                                    </OverlayTrigger>
                                                                ) : (
                                                                    <span className="d-inline-block">
                                                                        <Button
                                                                            variant="danger"
                                                                            size="sm"
                                                                            style={{ minWidth: '60px' }}
                                                                            onClick={() => confirmDelete(donation.id)}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this donation?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Donation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingDonation && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Food Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="food_type"
                                    value={editingDonation.food_type}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="quantity"
                                    value={editingDonation.quantity}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Expiration Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="expiration_date"
                                    value={editingDonation.expiration_date}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Pickup Option</Form.Label>
                                <Form.Select
                                    name="pickup_option"
                                    value={editingDonation.pickup_option || ''}
                                    onChange={handleEditChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="self_delivery">Self Delivery</option>
                                    <option value="request_pickup">Request Pickup</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="notes"
                                    value={editingDonation?.notes || ''}
                                    onChange={handleEditChange}
                                    placeholder="Add any extra details (e.g. provide instructions/directions)"
                                />
                            </Form.Group>

                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={submitEdit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>


            <footer className="footer text-center py-3 mt-auto">
                <p className="mb-0">© 2025 FeedoLog. All rights reserved.</p>
            </footer>
        </div>
    );
}
