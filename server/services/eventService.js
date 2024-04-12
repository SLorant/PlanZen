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

async function addEventService(title, start, end, color, taskId) {
  try {
    const data = {
      title: title,
      start: start,
      end: end,
      color: color,
      taskID: taskId ?? null,
      userID: pb.authStore.model.id,
    };
    await pb.collection("events").create(data);
  } catch (e) {
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

async function updateEventService(id, title, start, end, color) {
  try {
    const data = {
      title: title,
      start: start,
      end: end,
      color: color,
    };
    console.log(id);
    await pb.collection("events").update(`${id}`, data);
  } catch (e) {
    console.log(e);
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

export { getEventsService, addEventService, updateEventService };
