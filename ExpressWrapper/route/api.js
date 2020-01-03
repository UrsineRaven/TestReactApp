var express = require('express');
const helper = require('../helpers');
var router = express.Router();

// TODO: add logging...

// // middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

// Events
router.get('/events', async function getEvents(req, res) {
    try {
        let events = await helper.getEvents();
        events = events.map((evt) => {
            evt.event = evt.type;
            delete evt.type;
            return evt;
        });
        res.json(events);
    } catch (error) {
        console.dir(error);
        res.status(500).send('Failed to retrieve events.');
    }
});
router.route('/events/:eventId')
    .get(async function getEvent(req, res) {
        try {
            let event = (await helper.getEvent(req.params.eventId));
            event.event = event.type;
            delete event.type;
            res.json(event);
        } catch (error) {
            console.dir(error);
            res.status(404).send(`Couldn't find/retrieve event with id: ${req.params.eventId}`);
        }
    })
    .post(async function postEvent(req, res) {
        try {
            let event = req.body;
            event.type = event.event;
            delete event.event;
            await helper.addEvent(event);
            res.send("success");
        } catch (error) {
            console.dir(error);
            res.status(500).send(`Failed to add event with id: ${req.params.eventId}`);
        }
    })
    .put(function putEvent(req, res) {
        // Won't be modifying events, since we can just delete them and recreate them
        res.status(404).send("API doesn't support modifying events");
    })
    .delete(async function deleteEvent(req, res) {
        try {
            res.json(await helper.deleteEvent(req.params.eventId));
        } catch (error) {
            console.dir(error);
            res.status(404).send(`Couldn't find/delete event with id: ${req.params.eventId}`);
        }
    });

// Event Types
router.get('/event-types', async function getEventTypes(req, res) {
    try {
        res.json(await helper.getEventTypes());
    } catch (error) {
        console.dir(error);
        res.status(500).send('Failed to retrieve event types.');
    }
});
router.route('/event-types/:eventTypeId')
    .get(function getEventType(req, res) {
        // Currently no need to get a single event type
        res.status(404).send("API doesn't support retrieving a single event type");
    })
    .post(async function postEventType(req, res) {
        try {
            res.json(await helper.addEventType(req.body));
        } catch (error) {
            console.dir(error);
            res.status(500).send(`Failed to add event type with id: ${req.params.eventTypeId}`);
        }
    })
    .put(function putEventType(req, res) {
        try {
            helper.modifyEventType(req.body);
            res.send("succeeded"); // TODO: if new event type was created, return the new id
        } catch (error) {
            console.dir(error);
            res.status(404).send(`Couldn't find/update event type with id: ${req.params.eventId}`);
        }
    })
    .delete(function deleteEventType(req, res) {
        // Won't be deleting event types, since we just mark them as hidden
        res.status(404).send("API doesn't support deleting event types");
    });

module.exports = router