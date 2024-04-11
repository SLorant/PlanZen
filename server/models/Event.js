const Event = {
  type: "object",
  required: ["title"],
  required: ["start"],
  required: ["end"],
  properties: {
    title: { type: "string" },
    start: { type: "string" },
    end: { type: "string" },
    color: { type: "string" },
    taskId: { type: "string" },
  },
};
export default Event;
