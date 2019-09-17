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
                disabled={props.offlineOnly}
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
                disabled={props.offlineOnly}
              />
              <Form.Text as="small" className="text-muted">
                Allowing offline logging enables you to log events even when
                your device cannot access the server. You're device will sync
                with the server when it next has access. If the polling interval
                is disabled, it will try to access the server every 5 minutes.
              </Form.Text>
            </Form.Group>
            <hr />
            <Form.Group controlId="setOfflineOnly">
              <Form.Label>Offline Only</Form.Label>
              <Form.Check
                className="text-muted"
                type="checkbox"
                label="Never try to interact with server"
                checked={props.offlineOnly}
                onChange={evt => props.onChangeOfflineOnly(evt.target.checked)}
              />
              <Form.Text as="small" className="text-muted">
                Enabling offline only prevents the app from trying to pull
                changes from the server or push changes to the server. It stores
                all changes locally in the browser cache. When this mode is
                disabled, it will try to sync with the server again, pushing all
                changes that have been made since the mode was enabled.
              </Form.Text>
              <Form.Text as="small" className="text-muted">
                <strong>
                  Note: It will still pull changes to the site itself, just not
                  the data.
                </strong>
              </Form.Text>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default Settings;
