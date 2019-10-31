var express = require('express');
const helper = require('../helpers');
var router = express.Router();

// // middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

// Events
router.get('/events', async function getEvents(req, res) {
    try {
        res.json(await helper.getEvents());
    } catch (error) {
        res.status(500).send('Failed to retrieve events.');
    }
});
router.route('/events/:eventId')
    .get(async function getEvent(req, res) {
        try {
            res.json(await helper.getEvent(req.params.eventId)[0]);
        } catch (error) {
            res.status(404).send(`Couldn't find/retrieve event with id: ${req.params.eventId}`);
        }
    })
    .post(function postEvent(req, res) {
        // Won't be modifying events, since we can just delete them and recreate them
        res.status(404).send("API doesn't support modifying events");
    })
    .put(async function putEvent(req, res) {
        try {
            res.json(await helper.addEvent(req.body));
        } catch (error) {
            res.status(500).send(`Failed to add event with id: ${req.params.eventId}`);
        }
    })
    .delete(async function deleteEvent(req, res) {
        try {
            res.json(await helper.deleteEvent(req.params.eventId)[0]);
        } catch (error) {
            res.status(404).send(`Couldn't find/delete event with id: ${req.params.eventId}`);
        }
    });

// Event Types
router.get('/event-types', async function getEventTypes(req, res) {
    try {
        res.json(await helper.getEventTypes());
    } catch (error) {
        res.status(500).send('Failed to retrieve event types.');
    }
});
router.route('/event-types/:eventTypeId')
    .get(function getEventType(req, res) {
        // Currently no need to get a single event type
        res.status(404).send("API doesn't support retrieving a single event type");
    })
    .post(function postEventType(req, res) {
        try {
            helper.modifyEventType(req.body);
            res.send("succeeded"); // TODO: if new event type was created, return the new id
        } catch (error) {
            res.status(404).send(`Couldn't find/update event type with id: ${req.params.eventId}`);
        }
    })
    .put(async function putEventType(req, res) {
        try {
            res.json(await helper.addEventType(req.body));
        } catch (error) {
            res.status(500).send(`Failed to add event type with id: ${req.params.eventTypeId}`);
        }
    })
    .delete(function deleteEventType(req, res) {
        // Won't be deleting event types, since we just mark them as hidden
        res.status(404).send("API doesn't support deleting event types");
    });

module.exports = router