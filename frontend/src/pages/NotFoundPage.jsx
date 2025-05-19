import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../images/f.png';
import '../styles/Homepage.css';

export default function NotFoundPage() {
  return (
    <div className="home-page d-flex flex-column min-vh-100">
      {/* Navbar */}
      <Navbar expand="lg" className="navbar">
        <Container>
          <Navbar.Brand href="/">
            <img src={logo} alt="Logo" height="50" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="nav-custom-link me-3">Home</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 404 Content */}
      <Container className="my-5 text-center flex-grow-1">
        <h1 className="display-4">404 - Page Not Found 🚫</h1>
        <p className="lead mt-3">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary mt-4">Go Back to Home</Link>
      </Container>

      {/* Footer */}
      <footer className="footer text-center py-3 mt-auto">
        <p className="mb-0">© 2025 FeedoLog. All rights reserved.</p>
      </footer>
    </div>
  );
}
