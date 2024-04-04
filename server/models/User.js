const User = {
  type: "object",
  required: ["name"],
  required: ["password"],
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    birthdate: { type: "string" },
  },
};

const UserExt = {
  type: "object",
  required: ["name"],
  required: ["email"],
  required: ["password"],
  required: ["birthdate"],
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    birthdate: { type: "string" },
  },
};

export { User, UserExt };
