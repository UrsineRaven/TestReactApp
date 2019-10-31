var torm = require('typeorm'),
	logEvent = require('./model/Event.js').Event,
	logEventType = require('./model/EventType.js').EventType;

torm.createConnection();

/**
 * Add an event
 * @param {logEvent} event - the event to add
 * @returns {Promise<logEvent>} promise containing the new event
 */
exports.addEvent = function(event) {
	return torm.getRepository(logEvent).save(event);
};

/**
 * Return information on an event
 * @param {number} eventId - the id of the event to return
 * @returns {Promise<logEvent[]>} promise with an array containing the requested Event
 */
exports.getEvent = function getEvent(eventId) {
	return torm.getRepository(logEvent).find({id: eventId});
};

/**
 * Delete an event
 * @param {number} eventId - the id of the event to remove
 * @returns {Promise<logEvent[]>} promise with an array containing the deleted Event
 */
exports.deleteEvent = function(eventId) {
	let repo = torm.getRepository(logEvent);
	return repo.find({id: eventId}).then(function(evt) {
		return repo.remove(evt);
	});
};

/**
 * Get all events
 * @returns {Promise<logEvent[]>} promise with an array contiaining the events
 */
exports.getEvents = function() {
	return torm.getRepository(logEvent).find({ order: { datetime: "DESC" } });
};

/**
 * Get all event types
 * @returns {Promise<logEventType[]>} promise with an array contiaining the event-types
 */
exports.getEventTypes = function() {
	return torm.getRepository(logEventType).find();
};

/**
 * Add an event type
 * @param {logEventType} eventType - the event type to add
 * @returns {Promise<logEventType>} promise containing the new event type
 */
exports.addEventType = function(eventType) {
	return torm.getRepository(logEventType).save(eventType);
};

/**
 * Modify event type.
 */
exports.modifyEventType = async function(eventType) {
	let repo = torm.getRepository(logEventType),
	    et = repo.find(eventType.id);
	if (eventType.hidden === true)
		repo.update(eventType.id, { hidden: true });
    // if name changes, hide old event type, and make new one (so history is preserved)
    // TODO: notify user of this behavior and make the rest of the code work the same way
	else if (et.name !== eventType.name) {
		et.hidden = true;
		await repo.save(et);
		await this.addEventType(eventType); // TODO: find unique id before saving it...
	}
	else
		await repo.update(eventType.id, eventType);
};
