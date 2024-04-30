import {
  addEventService,
  getEventsService,
  updateEventService,
  deleteEventService,
  getEventByTaskService,
} from "../services/eventService.js";

const getEvents = async (req, reply) => {
  try {
    const events = await getEventsService();
    reply.code(200).send(events);
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const getEventByTask = async (req, reply) => {
  const { taskID } = req.body;
  try {
    const event = await getEventByTaskService(taskID);
    reply.code(200).send(event);
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const addEvent = async (req, reply) => {
  const { title, start, end, color, isRecurring, taskId } = req.body;
  try {
    const isSuccess = await addEventService(title, start, end, color, taskId, isRecurring);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const updateEvent = async (req, reply) => {
  const event = req.body;
  try {
    const isSuccess = await updateEventService(
      event.id,
      event.title,
      event.start,
      event.end,
      event.color,
      event.isRecurring,
      event.until
    );
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const deleteEvent = async (req, reply) => {
  const event = req.body;
  try {
    const isSuccess = await deleteEventService(event.id);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

export { addEvent, getEvents, updateEvent, deleteEvent, getEventByTask };
