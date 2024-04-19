import PocketBase from "pocketbase";
import Api409Error from "../utils/errors/api409Error.js";
import Api401Error from "../utils/errors/api401Error.js";
import Api404Error from "../utils/errors/api404Error.js";
import Api500Error from "../utils/errors/api404Error.js";
import pb from "../database/SingletonDB.js";
import { addEventService, getEventByTaskService, updateEventService } from "./eventService.js";

async function getTasksService() {
  try {
    const taskList = await pb.collection("tasks").getList(1, 50, {
      filter: `userID = "${pb.authStore.model.id}"`,
      sort: "-created",
    });

    return taskList;
  } catch (e) {
    console.log(e);
    throw new Api404Error("No tasks found");
  }
}

async function addTaskService(name, description, isRecurring, isEvent, start, end, color) {
  try {
    const data = {
      name: name,
      description: description,
      isRecurring: isRecurring,
      isEvent: isEvent,
      userID: pb.authStore.model.id,
    };
    const result = await pb.collection("tasks").create(data);
    if (isEvent) {
      await addEventService(name, start, end, color, result.id);
    }
  } catch (e) {
    console.log(e);
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

async function updateTaskService(id, name, description, isRecurring, isEvent, start, end, color) {
  try {
    const data = {
      name: name,
      description: description,
      isRecurring: isRecurring,
      isEvent: isEvent,
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

async function deleteTaskService(id) {
  try {
    if (id) {
      await pb.collection("tasks").delete(`${id}`);
    } else return false;
  } catch (e) {
    console.log(e);
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

async function taskDoneService(id, isDone) {
  try {
    const data = {
      isDone: isDone,
    };
    await pb.collection("tasks").update(`${id}`, data);
  } catch (e) {
    console.log(e);
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

export { getTasksService, addTaskService, updateTaskService, deleteTaskService, taskDoneService };
