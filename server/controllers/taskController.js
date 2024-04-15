import { addTaskService, getTasksService, updateTaskService, deleteTaskService } from "../services/taskService.js";

const getTasks = async (req, reply) => {
  try {
    const tasks = await getTasksService();
    console.log(tasks);
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
  console.log(task);
  try {
    const isSuccess = await deleteTaskService(task.id);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

export { addTask, getTasks, updateTask, deleteTask };
