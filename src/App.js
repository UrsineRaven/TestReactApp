import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Bootstrap components
import Container from 'react-bootstrap/Container';

// Pages / Components
import About from './pages/About';
import DbRoutes from './components/DatabaseManagedRoutes';
import NavigationBar from './components/NavigationBar';
import Users from './pages/Users';

// Router
function AppRouter() {
  return (
    <Router>
      <Container>
        <NavigationBar />

        {DbRoutes()}
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </Container>
    </Router>
  );
}

export default AppRouter;
