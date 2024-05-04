import PocketBase from "pocketbase";
import Api409Error from "../utils/errors/api409Error.js";
import Api401Error from "../utils/errors/api401Error.js";
import Api404Error from "../utils/errors/api404Error.js";
import Api500Error from "../utils/errors/api404Error.js";
import pb from "../database/SingletonDB.js";

async function getEventsService(userID) {
  try {
    const eventList = await pb.collection("events").getList(1, 200, {
      query: { userID: userID },
      filter: `userID = "${userID}"`,
    });
    return eventList;
  } catch (e) {
    console.log(e);
    throw new Api404Error("No events found");
  }
}

async function getEventByTaskService(userID, taskID) {
  try {
    const event = await pb.collection("events").getFirstListItem(`userID = "${userID}" && taskID = "${taskID}"`, {
      query: { userID: userID },
    });
    return event;
  } catch (e) {
    console.log(e);
    throw new Api404Error("No events found");
  }
}

async function addEventService(title, start, end, color, taskId, isRecurring, userID) {
  try {
    const data = {
      title: title,
      start: start,
      end: end,
      color: color,
      isRecurring: isRecurring,
      until: isRecurring ? end : null,
      taskID: taskId ?? null,
      userID: userID,
    };
    await pb.collection("events").create(data);
  } catch (e) {
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

async function updateEventService(id, title, start, end, color, isRecurring, until, userID) {
  try {
    const data = {
      title: title,
      start: start,
      end: end,
      color: color,
      isRecurring: isRecurring,
      until: isRecurring ? until : null,
      userID: userID,
    };
    await pb.collection("events").update(`${id}`, data);
  } catch (e) {
    console.log(e);
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

async function deleteEventService(id, userID) {
  try {
    if (id) {
      await pb.collection("events").delete(`${id}`, {
        query: { userID: userID },
      });
    } else return false;
  } catch (e) {
    console.log(e);
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

export { getEventsService, addEventService, updateEventService, deleteEventService, getEventByTaskService };
