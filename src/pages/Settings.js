import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import PageHeading from '../components/PageHeading';

function Settings(props) {
  return (
    <>
      <PageHeading>Settings</PageHeading>
      <Card border="primary">
        <Card.Body>
          <Form>
            <Form.Text>
              <strong>
                NOTE: The settings on this page are saved per device.
              </strong>
            </Form.Text>
            <hr />
            <Form.Group controlId="setPollInterval">
              <Form.Label>Poll Interval (minutes)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={props.pollInterval}
                onChange={newVal =>
                  props.onChangePollInterval(newVal.target.value)
                }
              />
              <Form.Text as="small" className="text-muted">
                The data on the main page will automatically refresh this often.
                An interval of 0 disables it.
              </Form.Text>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default Settings;
