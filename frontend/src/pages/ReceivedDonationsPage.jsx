// import React, { useEffect, useState } from 'react';
// import { Container, Table, Button, Spinner, Navbar, Nav, Row, Col, Dropdown } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import API from '../services/api';
// import '../styles/Homepage.css';
// import logo from '../images/f.png';

// export default function ReceivedDonationsPage() {
//     const navigate = useNavigate();
//     const [donations, setDonations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [user, setUser] = useState(null);
//     const [updatingId, setUpdatingId] = useState(null); // To track which donation is being updated

//     useEffect(() => {
//         const storedUser = JSON.parse(localStorage.getItem('user'));
//         setUser(storedUser);
//         fetchReceivedDonations();
//     }, []);

//     const fetchReceivedDonations = async () => {
//         setLoading(true);
//         try {
//             const token = localStorage.getItem('token');
//             const response = await API.get('donations/received/', {
//                 headers: { Authorization: `Token ${token}` },
//             });
//             setDonations(response.data);
//         } catch (error) {
//             console.error('Error fetching received donations:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         navigate('/login');
//     };

//     const handleStatusChange = async (donationId, newStatus) => {
//         setUpdatingId(donationId);
//         try {
//             const token = localStorage.getItem('token');
//             await API.patch(
//                 `donations/${donationId}/status/`,
//                 { status: newStatus },
//                 { headers: { Authorization: `Token ${token}` } }
//             );
//             await fetchReceivedDonations(); // Refresh list after update
//         } catch (error) {
//             console.error('Error updating donation status:', error);
//             alert('Failed to update status. Please try again.');
//         } finally {
//             setUpdatingId(null);
//         }
//     };

//     if (!user || loading) {
//         return (
//             <div className="d-flex justify-content-center align-items-center vh-100">
//                 <Spinner animation="border" variant="primary" />
//             </div>
//         );
//     }

//     return (
//         <div className="home-page d-flex flex-column min-vh-100">
//             {/* Navbar */}
//             <Navbar expand="lg" className="navbar">
//                 <Container>
//                     <Navbar.Brand as={Link} to="/organization-dashboard">
//                         <img src={logo} alt="Logo" height="50" />
//                     </Navbar.Brand>
//                     <Navbar.Toggle aria-controls="basic-navbar-nav" />
//                     <Navbar.Collapse id="basic-navbar-nav">
//                         <Nav className="ms-auto">
//                             <Nav.Link as={Link} to="/organization-dashboard" className="nav-custom-link me-3">Home</Nav.Link>
//                             <Nav.Link as={Link} to="/received-donations" className="nav-custom-link me-3 active">Received Donations</Nav.Link>
//                             <Nav.Link as={Link} to="/donation-history" className="nav-custom-link me-3">Donation History</Nav.Link>
//                             <Nav.Link as={Link} to="/organization-profile" className="nav-custom-link me-3">Profile</Nav.Link>
//                             <Nav.Link onClick={handleLogout} className="nav-custom-link text-danger">Logout</Nav.Link>
//                         </Nav>
//                     </Navbar.Collapse>
//                 </Container>
//             </Navbar>

//             {/* Main Content */}
//             <Container className="my-5 flex-grow-1">
//                 <Row className="justify-content-center">
//                     <Col xs={12}>
//                         <h1 className="mb-4 text-center">📥 Received Donations</h1>

//                         {donations.length === 0 ? (
//                             <div className="text-center">
//                                 <p className="mb-4">No donations have been received yet.</p>
//                                 <Button onClick={() => navigate('/organization-dashboard')} className="purple-btn rounded-pill">
//                                     Back to Dashboard
//                                 </Button>
//                             </div>
//                         ) : (
//                             <div className="table-responsive">
//                                 <Table striped bordered hover className="mt-4 text-start">
//                                     <thead>
//                                         <tr>
//                                             <th>Food Type</th>
//                                             <th>Quantity</th>
//                                             <th>Expiration Date</th>
//                                             <th>Pickup Option</th>
//                                             <th>Donor</th>
//                                             <th>Created At</th>
//                                             <th>Status</th>
//                                             <th>Change Status</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {donations.map((donation) => (
//                                             <tr key={donation.id}>
//                                                 <td>{donation.food_type}</td>
//                                                 <td>{donation.quantity}</td>
//                                                 <td>{donation.expiration_date ? new Date(donation.expiration_date).toLocaleDateString() : 'N/A'}</td>
//                                                 <td>{donation.pickup_option || 'N/A'}</td>
//                                                 <td>
//                                                     {donation.donor_details && (donation.donor_details.first_name || donation.donor_details.last_name) ? (
//                                                         <>
//                                                             <strong>
//                                                                 {donation.donor_details.first_name || ''} {donation.donor_details.last_name || ''}
//                                                             </strong>
//                                                             <br />
//                                                             <small>{donation.donor_details.address || 'No address provided'}</small>
//                                                         </>
//                                                     ) : (
//                                                         'N/A'
//                                                     )}
//                                                 </td>

//                                                 <td>{new Date(donation.created_at).toLocaleString()}</td>
//                                                 <td>{donation.status}</td>
//                                                 <td>
//                                                     <Dropdown>
//                                                         <Dropdown.Toggle
//                                                             variant="secondary"
//                                                             id={`dropdown-status-${donation.id}`}
//                                                             disabled={updatingId === donation.id}
//                                                         >
//                                                             {updatingId === donation.id ? (
//                                                                 <Spinner animation="border" size="sm" />
//                                                             ) : (
//                                                                 'Change Status'
//                                                             )}
//                                                         </Dropdown.Toggle>

//                                                         <Dropdown.Menu>
//                                                             {['pending', 'accepted', 'declined'].map((statusOption) => (
//                                                                 <Dropdown.Item
//                                                                     key={statusOption}
//                                                                     onClick={() => handleStatusChange(donation.id, statusOption)}
//                                                                     active={donation.status === statusOption}
//                                                                 >
//                                                                     {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
//                                                                 </Dropdown.Item>
//                                                             ))}
//                                                         </Dropdown.Menu>
//                                                     </Dropdown>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </Table>

//                             </div>
//                         )}
//                     </Col>
//                 </Row>
//             </Container>

//             {/* Footer */}
//             <footer className="footer text-center py-3 mt-auto">
//                 <p className="mb-0">© 2025 FeedoLog. All rights reserved.</p>
//             </footer>
//         </div>
//     );
// }

import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Navbar, Nav, Row, Col, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import '../styles/Homepage.css';
import logo from '../images/f.png';

export default function ReceivedDonationsPage() {
    const navigate = useNavigate();
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [updatingId, setUpdatingId] = useState(null); // To track which donation is being updated

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser(storedUser);
        fetchReceivedDonations();
    }, []);

    const fetchReceivedDonations = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await API.get('donations/received/', {
                headers: { Authorization: `Token ${token}` },
            });
            setDonations(response.data);
        } catch (error) {
            console.error('Error fetching received donations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleStatusChange = async (donationId, newStatus) => {
        setUpdatingId(donationId);
        try {
            const token = localStorage.getItem('token');
            await API.patch(
                `donations/${donationId}/update-status/`, // <-- fixed URL here
                { status: newStatus },
                { headers: { Authorization: `Token ${token}` } }
            );
            await fetchReceivedDonations(); // Refresh list after update
        } catch (error) {
            console.error('Error updating donation status:', error);
            alert('Failed to update status. Please try again.');
        } finally {
            setUpdatingId(null);
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
            {/* Navbar */}
            <Navbar expand="lg" className="navbar">
                <Container>
                    <Navbar.Brand as={Link} to="/organization-dashboard">
                        <img src={logo} alt="Logo" height="50" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/organization-dashboard" className="nav-custom-link me-3">Home</Nav.Link>
                            <Nav.Link as={Link} to="/received-donations" className="nav-custom-link me-3 active">Received Donations</Nav.Link>
                            <Nav.Link as={Link} to="/donation-history" className="nav-custom-link me-3">Donation History</Nav.Link>
                            <Nav.Link as={Link} to="/organization-profile" className="nav-custom-link me-3">Profile</Nav.Link>
                            <Nav.Link onClick={handleLogout} className="nav-custom-link text-danger">Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Main Content */}
            <Container className="my-5 flex-grow-1">
                <Row className="justify-content-center">
                    <Col xs={12}>
                        <h1 className="mb-4 text-center">📥 Received Donations</h1>

                        {donations.length === 0 ? (
                            <div className="text-center">
                                <p className="mb-4">No donations have been received yet.</p>
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
                                            <th>Change Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {donations.map((donation) => (
                                            <tr key={donation.id}>
                                                <td>{donation.food_type}</td>
                                                <td>{donation.quantity}</td>
                                                <td>{donation.expiration_date ? new Date(donation.expiration_date).toLocaleDateString() : 'N/A'}</td>
                                                <td>{donation.pickup_option || 'N/A'}</td>
                                                <td>
                                                    {donation.donor_details && (donation.donor_details.first_name || donation.donor_details.last_name) ? (
                                                        <>
                                                            <strong>
                                                                {donation.donor_details.first_name || ''} {donation.donor_details.last_name || ''}
                                                            </strong>
                                                            <br />
                                                            <small>{donation.donor_details.address || 'No address provided'}</small>
                                                        </>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </td>

                                                <td>{new Date(donation.created_at).toLocaleString()}</td>
                                                <td>{donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}</td>
                                                <td>
                                                    <Dropdown>
                                                        <Dropdown.Toggle
                                                            variant="secondary"
                                                            id={`dropdown-status-${donation.id}`}
                                                            disabled={updatingId === donation.id}
                                                        >
                                                            {updatingId === donation.id ? (
                                                                <Spinner animation="border" size="sm" />
                                                            ) : (
                                                                'Change Status'
                                                            )}
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu>
                                                            {['pending', 'accepted', 'declined'].map((statusOption) => (
                                                                <Dropdown.Item
                                                                    key={statusOption}
                                                                    onClick={() => handleStatusChange(donation.id, statusOption)}
                                                                    active={donation.status === statusOption}
                                                                >
                                                                    {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                                                                </Dropdown.Item>
                                                            ))}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
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
