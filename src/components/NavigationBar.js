import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../resources/logo.svg';

function NavigationBar() {
  const [navCollapsed, setNavCollapsed] = useState(true);

  function changeCollapsed(toggle) {
    let collapse;
    if (toggle) collapse = !navCollapsed;
    else collapse = true;
    setNavCollapsed(collapse);
  }

  return (
    <Navbar expand="lg" bg="primary" variant="dark" expanded={!navCollapsed}>
      <Navbar.Brand href="/">
        <Logo className="d-inline-block align-top logo" />
        {' TestApp'}
      </Navbar.Brand>
      <Navbar.Toggle onClick={() => changeCollapsed(true)} />
      <Navbar.Collapse
        className="justify-content-end"
        onClick={() => changeCollapsed()}
      >
        <Nav>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/type-management/">
            Event Type Management
          </Nav.Link>
          <Nav.Link as={Link} to="/history/">
            Event History
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
  );
}

export default NavigationBar;
