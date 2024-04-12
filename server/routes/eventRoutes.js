import { addEvent, getEvents, updateEvent } from "../controllers/eventController.js";
import Message from "../models/Message.js";
import Event from "../models/Event.js";
import { authorize } from "../controllers/authController.js";

const getEventsOpts = {
  schema: {
    response: {
      500: Message,
      404: Message,
      200: {
        items: {
          type: "array",
          items: Event,
        },
      },
    },
  },
  preHandler: authorize,
  handler: getEvents,
};

const postEventOpts = {
  schema: {
    body: Event,
    /*    body: Event, */
    response: {
      500: Message,
      404: Message,
      401: Message,
      200: Message,
    },
  },
  preHandler: authorize,
  handler: addEvent,
};

const updateEventOpts = {
  schema: {
    body: Event,
    /*    body: Event, */
    response: {
      500: Message,
      404: Message,
      401: Message,
      200: Message,
    },
  },
  preHandler: authorize,
  handler: updateEvent,
};

const eventRoutes = (app, options, done) => {
  //Get all
  app.get("/events", getEventsOpts);

  app.post("/updateEvent", updateEventOpts);

  app.post("/addEvent", postEventOpts);

  done();
};

export { eventRoutes };