import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, Row, Col, Image } from 'react-bootstrap';
import '../styles/Homepage.css';
import logo from '../images/f.png';
import foodImage from '../images/food-image.webp';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Navbar */}
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand href="/">
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
      <div className="homepage-section">
        <Container fluid className="content">
          <Row className="align-items-center g-4">
            {/* Image Section */}
            <Col xs={12} md={5} className="d-flex justify-content-center align-items-center mt-4">
              <Image src={foodImage} alt="Food Donation" fluid />
            </Col>

            {/* Text Section */}
            <Col xs={12} md={7}>
              <div className="welcome-message mt-4">
                <h1 className="text-center">
                  Welcome to the Food Donation<br />
                  <strong className="sub-heading">& Waste Tracker</strong>
                </h1>

                <p className="text-center">Track your surplus food and donate to local organizations.</p>

                <br />

                <div className="features">
                  <p>
                    <span role="img" aria-label="rocket">🚀</span> <strong>What You Can Do Here:</strong>
                  </p>
                  <ul>
                    <li>
                      <span role="img" aria-label="memo">📝</span> Log extra food before it goes to waste
                    </li>
                    <li>
                      <span role="img" aria-label="trash bin">🗑️</span> Track your waste and see how you’re improving
                    </li>
                    <li>
                      <span role="img" aria-label="location">📍</span> Find donation centers near you with just a click
                    </li>
                    <li>
                      <span role="img" aria-label="chart">📊</span> Generate reports on your food waste reduction impact
                    </li>
                  </ul>
                  <p>
                    <span role="img" aria-label="green heart">💚</span> <strong>Join Us in Making a Difference</strong>
                  </p>
                  <p>Whether you're a restaurant, household, or volunteer—your contribution matters.</p>
                  <p><strong>Start tracking. Start donating. Start changing lives.</strong></p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="footer text-center">
        <p className="mb-0">© 2025 FeedoLog. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
