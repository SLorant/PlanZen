import PocketBase from "pocketbase";
import Api409Error from "../utils/errors/api409Error.js";
import Api401Error from "../utils/errors/api401Error.js";
import Api404Error from "../utils/errors/api404Error.js";
import Api500Error from "../utils/errors/api404Error.js";
import pb from "../database/SingletonDB.js";

async function getEventsService() {
  try {
    const eventList = await pb.collection("events").getList(1, 50, {
      filter: `userID = "${pb.authStore.model.id}"`,
    });
    return eventList;
  } catch (e) {
    console.log(e);
    throw new Api404Error("No events found");
  }
}

async function getEventByTaskService(taskID) {
  try {
    const event = await pb
      .collection("events")
      .getFirstListItem(`userID = "${pb.authStore.model.id}" && taskID = "${taskID}"`);
    return event;
  } catch (e) {
    console.log(e);
    throw new Api404Error("No events found");
  }
}

async function addEventService(title, start, end, color, taskId, isRecurring) {
  try {
    const data = {
      title: title,
      start: start,
      end: end,
      color: color,
      isRecurring: isRecurring,
      until: isRecurring ? end : null,
      taskID: taskId ?? null,
      userID: pb.authStore.model.id,
    };
    await pb.collection("events").create(data);
  } catch (e) {
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

async function updateEventService(id, title, start, end, color, isRecurring, until) {
  try {
    const data = {
      title: title,
      start: start,
      end: end,
      color: color,
      isRecurring: isRecurring,
      until: isRecurring ? until : null,
    };
    await pb.collection("events").update(`${id}`, data);
  } catch (e) {
    console.log(e);
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

async function deleteEventService(id) {
  try {
    if (id) {
      await pb.collection("events").delete(`${id}`);
    } else return false;
  } catch (e) {
    console.log(e);
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

export { getEventsService, addEventService, updateEventService, deleteEventService, getEventByTaskService };
