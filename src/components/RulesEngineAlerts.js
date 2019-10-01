import React from 'react';
import Alert from 'react-bootstrap/Alert';

function RulesEngineAlerts(props) {
  let alerts = [];

  // TODO: Rules Engine...

  const alertElements = alerts.map(alert => {
    return (
      <Alert
        variant={alert.type || 'info'}
        dismissible={!!alert.dismissible}
        onClose={alert.onClose || null}
      >
        {alert.text}
      </Alert>
    );
  });
  return alertElements;
}

export default RulesEngineAlerts;
