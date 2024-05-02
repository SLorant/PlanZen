import { addTask, getTasks, updateTask, deleteTask, taskDone } from "../controllers/taskController.js";
import Message from "../models/Message.js";
import Task from "../models/Task.js";
import { authorize } from "../controllers/authController.js";

const getTasksOpts = {
  schema: {
    response: {
      500: Message,
      404: Message,
      200: {
        items: {
          type: "array",
          items: Task,
        },
      },
    },
  },
  handler: getTasks,
};

const postTaskOpts = {
  schema: {
    body: Task,
    response: {
      500: Message,
      404: Message,
      401: Message,
      200: Message,
    },
  },
  handler: addTask,
};

const updateTaskOpts = {
  schema: {
    body: Task,
    response: {
      500: Message,
      404: Message,
      401: Message,
      200: Message,
    },
  },
  handler: updateTask,
};

const deleteTaskOpts = {
  schema: {
    body: {
      type: "object",
      properties: {
        id: { type: "string" },
        userID: { type: "string" },
      },
    },
    response: {
      500: Message,
      404: Message,
      401: Message,
      200: Message,
    },
  },
  handler: deleteTask,
};

const taskDoneOpts = {
  schema: {
    body: {
      type: "object",
      properties: {
        id: { type: "string" },
        isDone: { type: "boolean" },
      },
    },
    response: {
      500: Message,
      404: Message,
      401: Message,
      200: Message,
    },
  },
  handler: taskDone,
};

const taskRoutes = (app, options, done) => {
  //Get all
  app.get("/tasks/:userID", getTasksOpts);

  app.post("/updateTask", updateTaskOpts);

  app.delete("/deleteTask", deleteTaskOpts);

  app.post("/taskDone", taskDoneOpts);

  app.post("/addTask", postTaskOpts);

  done();
};

export { taskRoutes };
