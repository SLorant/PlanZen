const User = {
  type: "object",
  required: ["name"],
  required: ["password"],
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
  },
};

const UserExt = {
  type: "object",
  required: ["name"],
  required: ["email"],
  required: ["password"],
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
  },
};

export { User, UserExt };
