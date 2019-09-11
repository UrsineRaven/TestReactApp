import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { ReactComponent as Logo } from './resources/logo.svg';

// Bootstrap components
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

// Pages
import About from './pages/About';
import Home from './pages/Home';
import Types from './pages/Types';
import Users from './pages/Users';

// Test Data
const testDataEventTypes = [
  { name: '#1', id: '1' },
  { name: 'test', id: '2' },
  { name: 'meal', id: '3' },
  {
    name: 'Example',
    id: '4',
    formatting: '{"className":"table-warning", "style":{"fontStyle": "italic"}}'
  },
  { name: 'hidden-example', id: '5', hidden: true }
];

// Router
function AppRouter() {
  const [evtTypes, setEvtTypes] = useState(testDataEventTypes);

  function handleEditType(evt) {
    const index = evtTypes.findIndex(e => e.id === evt.id);
    if (index === -1) {
      setEvtTypes(evtTypes.concat([evt]));
    } else {
      let cp = evtTypes.slice();
      cp.splice(index, 1, evt);
      setEvtTypes(cp);
    }
  }

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
              <Nav.Link as={Link} to="/type-management/">
                Event Type Management
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

        <Route path="/" exact render={() => <Home evtTypes={evtTypes} />} />
        <Route
          path="/type-management/"
          exact
          render={() => (
            <Types evtTypes={evtTypes} onEditType={handleEditType} />
          )}
        />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </Container>
    </Router>
  );
}

export default AppRouter;
