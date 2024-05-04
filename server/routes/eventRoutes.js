import { addEvent, getEvents, updateEvent, deleteEvent, getEventByTask } from "../controllers/eventController.js";
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
  handler: getEvents,
};

const getEventOpts = {
  schema: {
    body: {
      type: "object",
      properties: {
        userID: { type: "string" },
        taskID: { type: "string" },
      },
    },
    response: {
      500: Message,
      404: Message,
      401: Message,
      200: Event,
    },
  },
  handler: getEventByTask,
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
  handler: updateEvent,
};

const deleteEventOpts = {
  schema: {
    body: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
    },
    response: {
      500: Message,
      404: Message,
      401: Message,
      200: Message,
    },
  },
  handler: deleteEvent,
};

const eventRoutes = (app, options, done) => {
  //Get all
  app.get("/events/:userID", getEventsOpts);

  app.post("/getEventByTask", getEventOpts);

  app.post("/updateEvent", updateEventOpts);

  app.delete("/deleteEvent", deleteEventOpts);

  app.post("/addEvent", postEventOpts);

  done();
};

export { eventRoutes };
