import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InlineFormGroup from '../components/FormElements/InlineFormGroup';
import PageHeading from '../components/PageHeading';
import '../styles/Settings.css';

function Settings(props) {
  const [showTimeSince, setShowTimeSince] = useState(
    props.timeSinceFormat &&
      (typeof props.timeSinceFormat === 'boolean' ||
        props.timeSinceFormat.charAt(0) !== '►')
  );

  function handleTimeSinceCheck(newVal) {
    if (newVal) {
      // If checkbox is now checked
      if (props.timeSinceFormat && typeof props.timeSinceFormat === 'string')
        // If there is a format defined
        props.onChangeTimeSinceFormat(
          props.timeSinceFormat.substring(1, props.timeSinceFormat.length - 1)
        );
      else props.onChangeTimeSinceFormat(true); // set value of format to true if one isn't defined
    } else {
      // If checkbox is now unchecked
      if (props.timeSinceFormat && typeof props.timeSinceFormat === 'string')
        // If there is a format defined
        props.onChangeTimeSinceFormat('►' + props.timeSinceFormat + '◄');
      else props.onChangeTimeSinceFormat(false); // set value of format to false if one isn't defined
    }
    setShowTimeSince(newVal);
  }

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
            <Form.Group controlId="setShowTimeSince">
              <Form.Label>Show Time Since</Form.Label>
              <Form.Check
                className="text-muted"
                type="checkbox"
                label="Show time since an event occurred on the history page"
                checked={showTimeSince}
                onChange={evt => handleTimeSinceCheck(evt.target.checked)}
              />
              <Form.Text as="small" className="text-muted">
                Enabling this adds a column on the Event History page that shows
                how long ago the event was logged.
              </Form.Text>
              <InlineFormGroup
                controlId="inputTimeSinceFormat"
                label="Time Since"
                className="child-inline-form-group"
              >
                <Form.Control
                  type="text"
                  placeholder="Optionally input format"
                  value={
                    typeof props.timeSinceFormat === 'boolean'
                      ? ''
                      : props.timeSinceFormat
                  }
                  onChange={evt =>
                    props.onChangeTimeSinceFormat(
                      evt.target.value || showTimeSince
                    )
                  }
                  {...(!showTimeSince && {
                    style: { textDecorationLine: 'line-through' }
                  })}
                  disabled={!showTimeSince}
                />
              </InlineFormGroup>
              <Form.Text as="small" className="text-muted ml-4">
                You may specify a format to display the time difference in. The
                valid placeholders are {'{year}'}, {'{month}'}, {'{week}'},{' '}
                {'{day}'}, {'{hour}'}, {'{minute}'}, {'{second}'}, and{' '}
                {'{millisecond}'}. <br /> For example,{' '}
                <code>{'{year}years, {day}d'}</code> would display the number of
                years and days since the event occured with 'years, ' after the
                number of years and 'd' after the number of days. The default
                format is: <code>{'{year}y{day}d'}</code>.
              </Form.Text>
            </Form.Group>
            <Form.Group controlId="setAllowOfflineChanges">
              <Form.Label>Allow Offline Changes</Form.Label>
              <Form.Check
                className="text-muted"
                type="checkbox"
                label="Enable adding events and managing event types when unable to access server"
                checked={props.allowOfflineChanges}
                onChange={evt =>
                  props.onChangeAllowOfflineChanges(evt.target.checked)
                }
                disabled={props.offlineOnly}
              />
              <Form.Text as="small" className="text-muted">
                Allowing offline changes enables you to log events and manage
                event types even when your device cannot access the server.
                You're device will sync with the server when it next has access.
                If the polling interval is disabled, it will try to access the
                server every 5 minutes.
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
