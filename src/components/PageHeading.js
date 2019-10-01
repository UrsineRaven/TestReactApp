import React from 'react';
import Alert from 'react-bootstrap/Alert';

function PageHeading(props) {
  let alerts = [];
  if (props.alerts)
    alerts = props.alerts.map(alert => {
      return (
        alert.text && (
          <Alert
            variant={alert.type || 'info'}
            dismissible={!!alert.dismissible}
            onClose={alert.onClose || null}
          >
            {alert.text}
          </Alert>
        )
      );
    });
  return (
    <>
      {alerts}
      <h3 className="my-3">{props.children}</h3>
    </>
  );
}

export default PageHeading;
