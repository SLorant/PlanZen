import {
  addTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
  taskDoneService,
} from "../services/taskService.js";

const getTasks = async (req, reply) => {
  try {
    const { userID } = req.params;
    const tasks = await getTasksService(userID);
    reply.code(200).send(tasks);
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const addTask = async (req, reply) => {
  const { userID, name, description, isRecurring, isEvent, start, end, color } = req.body;
  try {
    const isSuccess = await addTaskService(userID, name, description, isRecurring, isEvent, start, end, color);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const updateTask = async (req, reply) => {
  const { userID, id, name, description, isRecurring, isEvent, start, end, color } = req.body;
  try {
    const isSuccess = await updateTaskService(userID, id, name, description, isRecurring, isEvent, start, end, color);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const deleteTask = async (req, reply) => {
  const task = req.body;
  try {
    const isSuccess = await deleteTaskService(task.id, task.userID);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const taskDone = async (req, reply) => {
  const { id, isDone, userID } = req.body.data;
  try {
    const isSuccess = await taskDoneService(id, isDone, userID);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

export { addTask, getTasks, updateTask, deleteTask, taskDone };
