import { useState } from 'react';

//#region Test Data        TODO: Remove
const testDataEventTypes = [
  { name: '#1', id: '1', lastModified: 1568223239995 },
  { name: 'test', id: '2', lastModified: 1568223239996 },
  { name: 'meal', id: '3', lastModified: 1568223239997 },
  {
    name: 'Example',
    id: '4',
    formatting:
      '{"className":"table-warning", "style":{"fontStyle": "italic"}}',
    lastModified: 1568223239998
  },
  {
    name: 'hidden-example',
    id: '5',
    hidden: true,
    lastModified: 1568223239999
  },
  {
    name: 'Look at me!',
    id: '6',
    formatting:
      '{"className":"ani-loading ","style":{"fontStyle":"italic","textDecorationLine":"underline  line-through","fontVariant":"small-caps","fontWeight":"bold","fontSize":"1.25em","color":"#0000ff","textAlign":"center"}}',
    lastModified: 1570558195000
  }
];

const testDataEntries = [
  { datetime: 1568223240000, event: '1', id: '123' },
  { datetime: 1568237400000, event: '2', id: '235' },
  { datetime: 1568240640000, event: '3', id: '332' },
  { datetime: 1568229546000, event: '4', id: '331' },
  { datetime: 1568309640000, event: '4', id: '400' },
  { datetime: 1568323800000, event: '3', id: '404' },
  { datetime: 1568327040000, event: '2', id: '408' },
  { datetime: 1568315946000, event: '1', id: '402' },
  { datetime: 1570558195000, event: '6', id: '409' }
];
//#endregion

function useDatabase() {
  const [eventTypes, setEventTypes] = useState(testDataEventTypes);
  const [events, setEvents] = useState(testDataEntries);
  const [lastSync, setLastSync] = useState();
  const [notConnected, setNotConnected] = useState(false);

  /**
   * Attemps to pull the updated lists of event types and events.
   * @param {Array<EventType>} eventTypeChangeQueue - Array of event types to pass back if it fails to pull changes from the database.
   * @param {Array<EventObj>} eventChangeQueue - Array of events to pass back if it fails to pull changes from the database.
   * @returns {[boolean, Array<EventType>, Array<EventObj>]} Array containing whether it succeeds (index 0), the list of event types (index 1), and the list of events (index 2)
   */
  async function tryPullChanges(eventTypeChangeQueue, eventChangeQueue) {
    let responseTypes = eventTypeChangeQueue; // TODO: find a better way to handle this
    let responseEvts = eventChangeQueue;
    let success = true;
    // TODO: uncomment
    try {
      // const typeResponse = await fetch('/event-types');
      // if (typeResponse.ok) responseTypes = await typeResponse.json();
      // else throw new Error('non-success response');
      // const evtResponse = await fetch('/events');
      // if (evtResponse.ok) responseEvts = await evtResponse.json();
      // else throw new Error('non-success response');
      // eventTypeChangeQueue = responseTypes;
      // eventChangeQueue = responseEvts;
      setLastSync(new Date().getTime());
    } catch {
      success = false;
    }
    return [success, responseTypes, responseEvts];
  }

  /**
   * Determine if the event type is new or modified and take the appropriate action in the database.
   * @param {EventType} eventType - The event type to add/modify.
   * @returns {boolean} True if the transaction succeeds.
   */
  async function tryModifyType(eventType) {
    let succeeds = true;
    const index = eventTypes.findIndex(e => e.id === eventType.id);
    let newType = index === -1;
    if (newType) {
      succeeds = tryAddType(eventType);
    } else {
      succeeds = tryUpdateType(eventType);
    }
    return succeeds;
  }

  /**
   * Attempt to add an event type to the database.
   * @param {EventType} eventType - The event type to add.
   * @returns {boolean} True if the add succeeds.
   */
  async function tryAddType(eventType) {
    let succeeds = true;
    try {
      const url = '/event-types';
      const options = {
        method: 'POST',
        body: JSON.stringify(eventType),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const typeResponse = await fetch(url, options);
      if (!typeResponse.ok) succeeds = false;
    } catch {
      succeeds = false;
    }
    return succeeds;
  }

  /**
   * Attempt to update an event type in the database.
   * @param {EventType} eventType - The modified event type to update.
   * @returns {boolean} True if the update succeeds.
   */
  async function tryUpdateType(eventType) {
    let succeeds = true;
    try {
      const url = `/event-types/${eventType.id}`;
      const options = {
        method: 'PUT',
        body: JSON.stringify(eventType),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const typeResponse = await fetch(url, options);
      if (!typeResponse.ok) succeeds = false;
    } catch {
      succeeds = false;
    }
    return succeeds;
  }

  /**
   * Attempt to add an event to the database.
   * @param {EventObj} newEvent - The event to add.
   * @returns {boolean} True if the add succeeds.
   */
  async function tryAddEvent(newEvent) {
    let succeeds = true;
    try {
      const url = '/events';
      const options = {
        method: 'POST',
        body: JSON.stringify(newEvent),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const typeResponse = await fetch(url, options);
      if (!typeResponse.ok) succeeds = false;
    } catch {
      succeeds = false;
    }
    return succeeds;
  }

  /**
   * Attempt to delete an event from the database.
   * @param {number} eventId - The ID of the event to delete.
   * @returns {boolean} True if the delete succeeds.
   */
  async function tryDeleteEvent(eventId) {
    let succeeds = true;
    try {
      const url = `/events/${eventId}`;
      const options = {
        method: 'DELETE'
      };
      const typeResponse = await fetch(url, options);
      if (!typeResponse.ok) succeeds = false;
    } catch {
      succeeds = false;
    }
    return succeeds;
  }

  /**
   * Adds/modifies multiple event types in the database.
   * @param {Array<EventType>} eventTypesToModify - Array of event types to be added to/modified in the database.
   * @param {Array<EventType>} eventTypeChangeQueue - Working array of event types to be applied after all bulk changes are complete.
   * @returns {Array<number>} Array of event types that were successfully added to/modified in the database.
   */
  function bulkUpdateEventTypes(eventTypesToModify, eventTypeChangeQueue) {
    let successes = [];
    const array = eventTypesToModify.slice();
    // eslint-disable-next-line no-unused-vars
    for (let evtType of array) {
      // TODO: maybe update event types in bulk and respond with failures
      let success = true;
      const origId = evtType.id;
      const index = eventTypes.findIndex(e => e.id === evtType.id);
      const newType = index === -1;
      // Handle id conflicts
      const i = eventTypeChangeQueue.find(t => t.id === evtType.id);
      if (i) {
        if (newType) {
          // get the highest existing event id.   TODO: check if there's a more efficient way
          const ids = eventTypeChangeQueue
            .map(t => t.id)
            .concat(eventTypesToModify.map(t => t.id));
          let max = -1;
          for (let i of ids) if (i > max) max = i; // eslint-disable-line no-unused-vars

          evtType.id = String(Number(max) + 1);
        } else if (i.lastModified > evtType.lastModified) {
          const index = eventTypesToModify.indexOf(evtType);
          eventTypesToModify.splice(index, 1);
          continue;
        }
      }

      // TODO: uncomment
      // if (newType) {
      //   success = tryAddType(evtType);
      // } else {
      //   success = tryUpdateType(evtType);
      // }
      if (success) {
        const idx = eventTypesToModify.findIndex(t => t.id === origId);
        successes.push(eventTypesToModify.splice(idx, 1)[0]);
      }
    }
    return successes;
  }

  /**
   * Adds multiple events to the database.
   * @param {Array<EventObj>} eventsToAdd - Array of events to be added to the database.
   * @returns {Array<EventObj>} Array of events that were successfully added to the database.
   */
  function bulkAddEvents(eventsToAdd) {
    let successes = [];
    const array = eventsToAdd.slice();
    // eslint-disable-next-line no-unused-vars
    for (let evt of array) {
      // TODO: maybe add events in bulk and respond with failures
      //if (tryAddEvent(evt)) {
      if (true) {
        // TODO: Delete and uncomment line above
        const index = eventsToAdd.indexOf(evt);
        successes.push(eventsToAdd.splice(index, 1)[0]);
      }
    }
    return successes;
  }

  /**
   * Deletes multiple events from the database.
   * @param {Array<number>} eventsToDelete - List of ID's of the events to be deleted from the database.
   * @param {Array<EventObj>} eventChangeQueue - Working array of the events to be applied after all bulk changes are complete.
   * @returns {Array<number>} Array of ID's of the events that were successfully deleted from the database.
   */
  function bulkDeleteEvents(eventsToDelete, eventChangeQueue) {
    let successes = [];
    const array = eventsToDelete.slice();
    // eslint-disable-next-line no-unused-vars
    for (let id of array) {
      // skip delete if event has been updated since last sync
      const i = eventChangeQueue.findIndex(
        e => e.id === id && e.lastModified > lastSync
      );
      if (i !== -1) {
        const index = eventsToDelete.indexOf(id);
        eventsToDelete.splice(index, 1);
        continue;
      }
      // TODO: maybe delete events in bulk and respond with failures
      //if (tryDeleteEvent(id)) {
      if (true) {
        // TODO: Delete and uncomment line above
        const index = eventsToDelete.indexOf(id);
        successes.push(eventsToDelete.splice(index, 1)[0]);
      }
    }
    return successes;
  }

  /**
   * Modify/add the specified event types in the local memory (RAM) copy of the event types.
   * @param {Array<EventType>} eventTypesToModify - Array of modified/new event types to change in RAM.
   * @param {Array<EventType>} [eventTypeChangeQueue] - The working array of event types to be applied after all bulk changes are finished.
   * @returns {void|Array<EventType>} Returns the updated eventChangeQueue if one is specified.
   */
  function updateEventTypesInRAM(eventTypesToModify, eventTypeChangeQueue) {
    let types = eventTypes.slice();
    // eslint-disable-next-line no-unused-vars
    for (let eType of eventTypesToModify) {
      const index = types.findIndex(t => t.id === eType.id);
      if (index >= 0) {
        types.splice(index, 1, eType);
      } else {
        types.push(eType);
      }
    }
    if (!eventTypeChangeQueue) {
      setEventTypes(types);
    } else {
      return types;
    }
  }

  /**
   * Add the specified events to the local memory (RAM) copy of the events.
   * @param {Array<EventObj>} eventsToAdd - Array of events to add to RAM.
   * @param {Array<EventObj>} [eventChangeQueue] - The working array of events to be applied after all bulk changes are finished.
   * @returns {void|Array<EventObj>} Returns the updated eventChangeQueue if one is specified.
   */
  function addNewEventsToRAM(eventsToAdd, eventChangeQueue) {
    if (!eventChangeQueue) {
      setEvents(events.concat(eventsToAdd));
    } else {
      return eventChangeQueue.concat(eventsToAdd);
    }
  }

  /**
   * Delete the specified events from the local memory (RAM) copy of the events.
   * @param {Array<number>} eventsToDelete - Array of ID's of events to delete from RAM.
   * @param {boolean} [isBulkChange] - Set to true if this is part of a bulk change.
   * @returns {void|Array<EventObj>} Returns the array of events after deleting the events specified if isBulkChange is true.
   */
  function deleteEventsFromRAM(eventsToDelete, isBulkChange) {
    const resultRows = events.slice();
    // eslint-disable-next-line no-unused-vars
    for (let id of eventsToDelete) {
      const index = resultRows.findIndex(r => r.id === id);
      resultRows.splice(index, 1);
    }
    if (!isBulkChange) {
      setEvents(resultRows);
    } else {
      return resultRows;
    }
  }

  return {
    events: events,
    eventTypes: eventTypes,
    lastSync: lastSync,
    notConnected: notConnected,
    setEvents: setEvents, // TODO: maybe don't directly expose these
    setEventTypes: setEventTypes,
    setNotConnected: setNotConnected, // TODO: handle this internally instead of passing it out
    updateEventTypesInRAM: updateEventTypesInRAM,
    addNewEventsToRAM: addNewEventsToRAM,
    deleteEventsFromRAM: deleteEventsFromRAM,
    bulkUpdateEventTypes: bulkUpdateEventTypes,
    bulkDeleteEvents: bulkDeleteEvents,
    bulkAddEvents: bulkAddEvents,
    tryPullChanges: tryPullChanges,
    tryModifyType: tryModifyType,
    tryAddEvent: tryAddEvent,
    tryDeleteEvent: tryDeleteEvent
  };
}

export default useDatabase;
