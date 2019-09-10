import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { ReactComponent as Logo } from './resources/logo.svg';

// Bootstrap components
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

// Pages
import About from './pages/About';
import Home from './pages/Home';
import Users from './pages/Users';

// Router
function AppRouter() {
  return (
    <Router>
      <Container>
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
          <Navbar.Brand href="/">
            <Logo className="d-inline-block align-top logo" />
            {' TestApp'}
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/about/">
                About
              </Nav.Link>
              <Nav.Link as={Link} to="/users/">
                Users
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Route path="/" exact component={Home} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </Container>
    </Router>
  );
}

export default AppRouter;
