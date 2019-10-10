import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';

//#region Test Data   // TODO: remove
const testRuleTypes = [
  {
    /* time since an event occurred */
  },
  {
    /* Minimum time between events */
  }
];
const testRules = [{}];
//#endregion

function RulesEngineAlerts(props) {
  const [ruleTypes, setRuleTypes] = useState(testRuleTypes); // TODO: move up to DatabaseManagedRoutes
  const [rules, setRules] = useState(testRules); // TODO: move up to DatabaseManagedRoutes

  let alerts = [];

  // TODO: define a function to pass to setRuleTypes that determines what changed and creates a list to be re-validated (by the useEffect below)

  // TODO: use getRef to keep a dictionary mapping ruleTypes to functions

  useEffect(() => {
    // On load, validate rules, and create ruleType functions dictionary.
  }, []);

  useEffect(() => {
    // If a new rule type is added, validate it and add an alert if it's not valid.
  });

  // TODO: run rules on an interval, and allow setting the interval on the settings page

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

function validateRuleType(ruleType) {
  // TODO: write function
}

function generateRuleTypeFunction(ruleType) {
  // TODO: write function
}

export default RulesEngineAlerts;
