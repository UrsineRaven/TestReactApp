import useLocalStorage from '../hooks/useLocalStorage';

/**
 * Hook that tracks and applies changes in the local storage.
 */
function useLocalChanges() {
  /** @type {[LocalChangesObj, (localChanges:LocalChangesObj)=>void]} */
  const [changes, setChanges] = useLocalStorage('local-changes', null);

  /**
   * Track modifications to the event type in the local changes.
   * @param {EventType} eventType - The event type (after modifications) to be tracked in the local changes.
   */
  function trackEventType(eventType) {
    let newLocalChanges = Object.assign({}, changes || {});
    if (!newLocalChanges.eventTypes) newLocalChanges.eventTypes = [];

    // Remove event type with same ID in local changes
    const idx = newLocalChanges.eventTypes.findIndex(
      e => e.id === eventType.id
    );
    if (idx !== -1) newLocalChanges.eventTypes.splice(idx, 1);

    // Add new/modified event type to local changes
    newLocalChanges.eventTypes.push(eventType);
    setChanges(newLocalChanges);
  }

  /**
   * Track new event in the local changes.
   * @param {EventObj} newEvent - The new event that should be added to the local changes.
   */
  function trackNewEvent(newEvent) {
    let newLocalChanges = Object.assign({}, changes || {});
    if (!newLocalChanges.newEvents) newLocalChanges.newEvents = [];
    newLocalChanges.newEvents.push(newEvent);
    setChanges(newLocalChanges);
  }

  /**
   * Track deleted event in the local changes.
   * @param {number} eventId - The ID of the event that should be deleted in the local changes.
   */
  function trackDeletedEvent(eventId) {
    let newLocalChanges = Object.assign({}, changes || {});

    // make sure the id doesn't correspond to an id in the newEvents changes
    let index = -2;
    if (newLocalChanges && newLocalChanges.newEvents) {
      index = newLocalChanges.newEvents.findIndex(evt => evt.id === eventId);
    }

    if (index >= 0) {
      // event is in localChanges as new event, so we remove it
      newLocalChanges.newEvents.splice(index, 1);
    } else {
      if (!newLocalChanges.deleteEvents) newLocalChanges.deleteEvents = [];
      newLocalChanges.deleteEvents.push(eventId);
    }
    setChanges(newLocalChanges);
  }

  /**
   * Apply the local changes to the events and event types provided.
   * @param {Array<EventObj>} events - The array of events to apply the local changes to.
   * @param {Array<EventType>} eventTypes - The array of event types to apply the local changes to.
   * @returns {[Array<EventObj>, Array<EventType>]} Array containing the modified events (index 0) and event types (index 1)
   */
  function apply(events, eventTypes) {
    let updatedEvents = Array.isArray(events) ? events.slice() : [];
    let updatedEventTypes = Array.isArray(eventTypes) ? eventTypes.slice() : [];
    if (changes) {
      if (changes.newEvents) {
        updatedEvents = updatedEvents.concat(changes.newEvents);
      }
      if (changes.deleteEvents) {
        // eslint-disable-next-line no-unused-vars
        for (let id of changes.deleteEvents) {
          const index = updatedEvents.findIndex(evt => evt.id === id);
          if (index >= 0) updatedEvents.splice(index, 1);
        }
      }
      if (changes.eventTypes) {
        // eslint-disable-next-line no-unused-vars
        for (let eType of changes.eventTypes) {
          const index = updatedEventTypes.findIndex(t => t.id === eType.id);
          if (index >= 0) {
            updatedEventTypes.splice(index, 1, eType);
          } else {
            updatedEventTypes.push(eType);
          }
        }
      }
    }
    return [updatedEvents, updatedEventTypes];
  }

  return {
    changes: changes,
    setChanges: setChanges,
    trackEventType: trackEventType,
    trackNewEvent: trackNewEvent,
    trackDeletedEvent: trackDeletedEvent,
    apply: apply
  };
}

export default useLocalChanges;
