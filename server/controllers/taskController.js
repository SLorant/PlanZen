import {
  addTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
  taskDoneService,
} from "../services/taskService.js";

const getTasks = async (req, reply) => {
  try {
    const tasks = await getTasksService();
    reply.code(200).send(tasks);
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const addTask = async (req, reply) => {
  const { name, description, isRecurring, isEvent, start, end, color } = req.body;
  try {
    const isSuccess = await addTaskService(name, description, isRecurring, isEvent, start, end, color);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const updateTask = async (req, reply) => {
  const task = req.body;
  try {
    const isSuccess = await updateTaskService(task.id, task.title, task.start, task.end, task.color);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const deleteTask = async (req, reply) => {
  const task = req.body;
  try {
    const isSuccess = await deleteTaskService(task.id);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const taskDone = async (req, reply) => {
  const { id, isDone } = req.body.data;
  try {
    const isSuccess = await taskDoneService(id, isDone);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

export { addTask, getTasks, updateTask, deleteTask, taskDone };
