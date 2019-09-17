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
            <Form.Group controlId="setShowHiddenTyeps">
              <Form.Label>Show Deleted Types</Form.Label>
              <Form.Check
                className="text-muted"
                type="checkbox"
                label="Show deleted event types on the type management page"
                checked={props.showHiddenTypes}
                onChange={evt =>
                  props.onChangeShowHiddenTypes(evt.target.checked)
                }
              />
              <Form.Text as="small" className="text-muted">
                Showing deleted event types on the type management page allows
                you to restore those event types.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="setAllowOfflineLogging">
              <Form.Label>Allow Offline Logging</Form.Label>
              <Form.Check
                className="text-muted"
                type="checkbox"
                label="Enable adding events when unable to access server"
                checked={props.allowOfflineLogging}
                onChange={evt =>
                  props.onChangeAllowOfflineLogging(evt.target.checked)
                }
              />
              <Form.Text as="small" className="text-muted">
                Allowing offline logging enables you to log events even when
                your device cannot access the server. You're device will sync
                with the server when it next has access. If the polling interval
                is disabled, it will try to access the server every 5 minutes.
              </Form.Text>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default Settings;
