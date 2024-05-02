import PocketBase from "pocketbase";
import Api409Error from "../utils/errors/api409Error.js";
import Api401Error from "../utils/errors/api401Error.js";
import Api404Error from "../utils/errors/api404Error.js";
import Api500Error from "../utils/errors/api404Error.js";
import pb from "../database/SingletonDB.js";
import moment from "moment";
import { addEventService, getEventByTaskService, updateEventService } from "./eventService.js";

async function getTasksService(userID) {
  try {
    const user = await pb.collection("users").getFirstListItem(`id="${userID}"`, {
      query: { userID: userID },
    });

    const taskList = await pb.collection("tasks").getList(1, 50, {
      query: { userID: userID },
      /*   headers: { userID: userID }, */
      filter: `userID = "${userID}"`,
      sort: "-created",
    });

    if (user.lastTaskFetch) {
      if (moment(user.lastTaskFetch).isBefore(moment(), "day")) {
        taskList.items.map((item) => {
          if (item.isRecurring) {
            item.isDone = false;
          }
        });
      }
    }
    const data = {
      lastTaskFetch: moment(),
    };
    await pb.collection("users").update(`${userID}`, data);

    return taskList;
  } catch (e) {
    console.log(e);
    throw new Api404Error("No tasks found");
  }
}

async function addTaskService(userID, name, description, isRecurring, isEvent, start, end, color) {
  console.log(userID);
  try {
    const data = {
      name: name,
      description: description,
      isRecurring: isRecurring,
      isDone: false,
      isEvent: isEvent,
      userID: userID,
    };
    console.log(data);
    const result = await pb.collection("tasks").create(data);
    /*   if (isEvent) {
      await addEventService(name, start, end, color, result.id);
    } */
  } catch (e) {
    console.log(e);
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

async function updateTaskService(userID, id, name, description, isRecurring, isEvent, start, end, color) {
  try {
    const data = {
      name: name,
      description: description,
      isRecurring: isRecurring,
      isEvent: isEvent,
      userID: userID,
    };
    const result = await pb.collection("tasks").update(`${id}`, data);
    try {
      const event = await getEventByTaskService(id);
      if (event) {
        await updateEventService(event.id, name, start, end, color);
      }
    } catch {
      await addEventService(name, start, end, color, id);
    }
  } catch (e) {
    console.log(e);
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

async function deleteTaskService(id, userID) {
  try {
    if (id) {
      console.log(id);
      await pb.collection("tasks").delete(`${id}`, {
        query: { userID: userID },
      });
    } else return false;
  } catch (e) {
    console.log(e);
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

async function taskDoneService(id, isDone, userID) {
  try {
    const data = {
      isDone: isDone,
      userID: userID,
    };
    await pb.collection("tasks").update(`${id}`, data);
  } catch (e) {
    console.log(e);
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

export { getTasksService, addTaskService, updateTaskService, deleteTaskService, taskDoneService };
