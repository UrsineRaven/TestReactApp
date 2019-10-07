import React from 'react';

/**
 * Wizard page stating that the user is done.
 * @param {WizardPageProps} props - the props object for the Choose Font Style wizard page
 */
function FinishPage(props) {
  const stepName = 'Finish';
  const stepDescription = 'Click Save to apply your formatting changes.';
  return (
    props.steps[props.curStep] === stepName && (
      <>
        <h5>{stepName}</h5>
        <span className="form-text">{stepDescription}</span>
      </>
    )
  );
}

export default FinishPage;
