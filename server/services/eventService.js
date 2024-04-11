import PocketBase from "pocketbase";
import Api409Error from "../utils/errors/api409Error.js";
import Api401Error from "../utils/errors/api401Error.js";
import Api404Error from "../utils/errors/api404Error.js";
import Api500Error from "../utils/errors/api404Error.js";
import pb from "../database/SingletonDB.js";

async function getEventsService() {
  let events = {};
  console.log(pb.authStore.model.id);
  try {
    const eventList = await pb.collection("events").getList(1, 50, {
      filter: `userID = "${pb.authStore.model.id}"`,
    });
    console.log(eventList);
  } catch (e) {
    console.log(e);
    throw new Api404Error("No events found");
  }

  return quote;
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

export { getEventsService, addEventService };
