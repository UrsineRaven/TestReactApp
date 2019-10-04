import React, { useState } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import { getLocalIsoDateAndTime } from '../helpers/TimeHelpers';
import '../styles/Modal.css';
import '../styles/RowFormattingWizard.css';
import '../styles/Table.css';
import TableRow from './TableRow';
import ChooseClass from './WizardPages/ChooseClass';
import ChooseFontStyle from './WizardPages/ChooseFontStyle';
import ChooseRowStyle from './WizardPages/ChooseRowStyle';
import FinishPage from './WizardPages/FinishPage';

function RowFormattingWizard(props) {
  const [showWizard, setShowWizard] = useState(false);
  const [curStep, setCurStep] = useState(0);
  const [formatting, setFormatting] = useState(parse(props.formatting));

  const steps = [
    'Choose Class',
    'Choose Font Style',
    'Choose Row Style',
    'Finish'
  ];

  // Handlers
  function handleWizardBtn() {
    resetWizard();
    setShowWizard(prev => !prev);
  }

  function handleDismiss() {
    resetWizard();
    setShowWizard(false);
  }

  function handleDone() {
    props.setFormatting(JSON.stringify(formatting));
    handleDismiss();
  }

  // Helpers
  function parse(formattingString) {
    const obj = JSON.parse(formattingString || '{}');
    return obj;
  }

  function resetWizard() {
    setCurStep(0);
    setFormatting(parse(props.formatting));
  }

  // JSX generation
  const breadcrumbs = steps.map((name, index) => {
    return (
      index <= curStep && (
        <Breadcrumb.Item
          {...(index === curStep && { active: true })}
          {...(index < curStep && { href: '#' })}
          key={name}
          onClick={evt => {
            evt.preventDefault();
            setCurStep(index);
          }}
        >
          {name}
        </Breadcrumb.Item>
      )
    );
  });
  const [date, time] = getLocalIsoDateAndTime(new Date());
  return (
    <>
      <Modal show={showWizard} onHide={handleDismiss} dialogClassName="modal-w">
        <Modal.Header closeButton>
          <Modal.Title>Row Formatting Wizard</Modal.Title>
        </Modal.Header>
        <Breadcrumb className="modal-breadcrumb">{breadcrumbs}</Breadcrumb>
        <Table className="example-row" bordered size="sm">
          <tbody>
            <TableRow
              date={date}
              event="Example event..."
              formatting={JSON.stringify(formatting)}
              onDelete={() => null}
              time={time}
            ></TableRow>
          </tbody>
        </Table>
        <Modal.Body>
          <ChooseClass
            curStep={curStep}
            steps={steps}
            formatting={formatting}
            setFormatting={setFormatting}
          />
          <ChooseFontStyle
            curStep={curStep}
            steps={steps}
            formatting={formatting}
            setFormatting={setFormatting}
          />
          <ChooseRowStyle
            curStep={curStep}
            steps={steps}
            formatting={formatting}
            setFormatting={setFormatting}
          />
          <FinishPage curStep={curStep} steps={steps} />
        </Modal.Body>
        <Modal.Footer className="row justify-content-around">
          {curStep > 0 && (
            <Button
              variant="secondary"
              className="col-md-3 col-5"
              onClick={() => setCurStep(curStep > 0 ? curStep - 1 : 0)}
            >
              Previous
            </Button>
          )}
          {curStep < steps.length - 1 && (
            <Button
              variant="primary"
              className="col-md-3 col-5"
              onClick={() =>
                setCurStep(
                  curStep < steps.length - 1 ? curStep + 1 : steps.length - 1
                )
              }
            >
              Next
            </Button>
          )}
          {curStep === steps.length - 1 && (
            <Button
              variant="primary"
              className="col-md-3 col-5"
              onClick={handleDone}
            >
              Finish
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Button variant="primary" onClick={() => handleWizardBtn()}>
        #
      </Button>
    </>
  );
}

export default RowFormattingWizard;
