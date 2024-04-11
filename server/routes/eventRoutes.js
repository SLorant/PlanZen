import { addEvent, getEvents } from "../controllers/eventController.js";
import Message from "../models/Message.js";
import Event from "../models/Event.js";
import { authorize } from "../controllers/authController.js";

const getEventsOpts = {
  schema: {
    response: {
      500: Message,
      404: Message,
      200: Event,
    },
  },
  preHandler: authorize,
  handler: getEvents,
};

const postEventOpts = {
  schema: {
    body: Event,
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

const eventRoutes = (app, options, done) => {
  //Get all
  app.get("/events", getEventsOpts);

  app.post("/addEvent", postEventOpts);

  done();
};

export { eventRoutes };
