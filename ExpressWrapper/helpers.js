const pathResolve = require('path').resolve;
const sqlite = require('sqlite3');
const config = require('./siteConfig.json');
require('../src/helpers/JSDocTypeDefs');

// #region Setup Database
// TODO: Add error handling for Database failing to create/open
const db = new sqlite.Database(
    pathResolve(__dirname, config.Database.File),
    (err) => {
        if (!err) {
            db.run(
                'CREATE TABLE IF NOT EXISTS event_type(\
                    id INTEGER PRIMARY KEY,\
                    name TEXT NOT NULL,\
                    formatting TEXT,\
                    lastModified INTEGER,\
                    hidden BOOLEAN DEFAULT FALSE\
                )',
                (error) => {
                    if (!error) {
                        db.run(
                            'CREATE TABLE IF NOT EXISTS event(\
                                id INTEGER PRIMARY KEY,\
                                datetime INTEGER NOT NULL,\
                                type INTEGER REFERENCES event_type(id) ON DELETE SET NULL\
                            )',
                        );
                    }
                },
            );
        }
    });
// #endregion

/**
 * Add an event
 * @param {EventObj} event - the event to add
 * @returns {Promise<EventObj>} promise containing the new event
 */
exports.addEvent = function addEvent(event) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO event VALUES(${event.id}, ${event.datetime}, ${event.type})`,
               (err) => {
                   if (err) reject(err);
                   else resolve(event);
               });
    });
};

/**
 * Return information on an event
 * @param {number} eventId - the id of the event to return
 * @returns {Promise<EventObj>} promise containing the requested Event
 */
exports.getEvent = function getEvent(eventId) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM event WHERE id IS ${eventId}`,
               (err, row) => {
                   if (err) reject(err);
                   else resolve(row);
               });
    });
};

/**
 * Delete an event
 * @param {number} eventId - the id of the event to remove
 * @returns {Promise<EventObj>} promise containing the deleted Event
 */
exports.deleteEvent = async function deleteEvent(eventId) {
    const event = await exports.getEvent(eventId); // TODO: maybe remove this
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM event WHERE id IS ${eventId}`,
               (err) => {
                   if (err) reject(err);
                   else resolve(event);
               });
    });
};

/**
 * Get all events
 * @returns {Promise<EventObj[]>} promise with an array contiaining the events
 */
exports.getEvents = function getEvents() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM event ORDER BY datetime DESC',
               (err, rows) => {
                   if (err) reject(err);
                   else resolve(rows);
               });
    });
};

/**
 * Get all event types
 * @returns {Promise<EventType[]>} promise with an array contiaining the event-types
 */
exports.getEventTypes = function getEventTypes() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM event_type',
               (err, rows) => {
                   if (err) reject(err);
                   else resolve(rows);
               });
    });
};

/**
 * Add an event type
 * @param {EventType} eventType - the event type to add
 * @returns {Promise<EventType>} promise containing the new event type
 */
exports.addEventType = function addEventType(eventType) {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO event_type VALUES(
                    ${eventType.id},
                    "${eventType.name}",
                    '${eventType.formatting || ''}',
                    ${eventType.lastModified || 'NULL'},
                    ${eventType.hidden || 'FALSE'}
                )`,
               (err) => {
                   if (err) reject(err);
                   else resolve(eventType);
               });
    });
};

/**
 * Modify event type.
 * @param {EventType} eventType - the event type to modify
 * @returns {Promise} promise for tracking completion
 */
exports.modifyEventType = function modifyEventType(eventType) {
    // const existingEvent = await new Promise((resolve, reject) => {
    //     db.get(`SELECT * FROM event WHERE id IS ${eventType.id}`,
    //            (err, row) => {
    //                if (err) reject(err);
    //                else resolve(row);
    //            });
    // });
    // // if name changes, hide old event type, and make new one (so history is preserved)
    // // TODO: notify user of this behavior and make the rest of the code work the same way
    // const newName = (existingEvent.name !== eventType.name);
    // if (newName) {
    //     const hideExistingType = new Promise((resolve, reject) => {
    //         db.run(`UPDATE event_type SET hidden = TRUE WHERE id IS ${eventType.id}`,
    //                (err) => {
    //                    if (err) reject(err);
    //                    else resolve();
    //                });
    //     });
    //     const addUpdatedType = exports.addEventType(eventType); // TODO: find unique id before saving it...
    //     return Promise.all([hideExistingType, addUpdatedType]);
    // } else {
    return new Promise((resolve, reject) => {
        db.run(`UPDATE event_type SET
                    formatting = '${eventType.formatting || ''}',
                    lastModified = ${eventType.lastModified || 'NULL'},
                    hidden = ${eventType.hidden || 'FALSE'}
                WHERE id IS ${eventType.id}`,
               (err) => {
                   if (err) reject(err);
                   else resolve();
               });
    });
    // }
};
