const Task = {
  type: "object",
  required: ["name"],
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    isRecurring: { type: "boolean" },
    isEvent: { type: "boolean" },
    isDone: { type: "boolean" },
    start: { type: "string" },
    end: { type: "string" },
    color: { type: "string" },
  },
};

/* const Task = {
  type: "object",
  required: ["id", "name", "description", "isRecurring", "isDone"],
  properties: {
    id: { type: "string" },
    name: { type: "string" }, // Assuming 'name' corresponds to 'title'
    description: { type: "string" },
    isRecurring: { type: "boolean" },
    isDone: { type: "boolean" },
    // Add other properties as needed
  },
}; */

export default Task;
