import React from 'react';
import Container from 'react-bootstrap/Container';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import DbRoutes from './components/DatabaseManagedRoutes';
import NavigationBar from './components/NavigationBar';
import About from './pages/About';

// Router
function AppRouter() {
  return (
    <Router>
      <Container>
        <NavigationBar />

        <DbRoutes />
        <Route path="/about/" component={About} />
      </Container>
    </Router>
  );
}

export default AppRouter;
