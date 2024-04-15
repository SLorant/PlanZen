import { addTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";
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
  preHandler: authorize,
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
  preHandler: authorize,
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
  preHandler: authorize,
  handler: updateTask,
};

const deleteTaskOpts = {
  schema: {
    body: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
    },
    response: {
      500: Message,
      404: Message,
      401: Message,
      200: Message,
    },
  },
  preHandler: authorize,
  handler: deleteTask,
};

const taskRoutes = (app, options, done) => {
  //Get all
  app.get("/tasks", getTasksOpts);

  app.post("/updateTask", updateTaskOpts);

  app.delete("/deleteTask", deleteTaskOpts);

  app.post("/addTask", postTaskOpts);

  done();
};

export { taskRoutes };
