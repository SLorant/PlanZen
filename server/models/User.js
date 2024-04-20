const User = {
  type: "object",
  required: ["name"],
  required: ["password"],
  properties: {
    name: { type: "string" },
    password: { type: "string" },
  },
};

const UserView = {
  type: "object",
  properties: {
    username: { type: "string" },
    email: { type: "string" },
  },
};

const UserExt = {
  type: "object",
  required: ["name"],
  required: ["email"],
  required: ["password"],
  required: ["passwordConfirm"],
  properties: {
    name: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    passwordConfrim: { type: "string" },
  },
};

export { User, UserExt, UserView };
