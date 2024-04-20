import { authorize, loginUser, registerUser, logout, getUserInfo } from "../controllers/authController.js";
import { User, UserExt, UserView } from "../models/User.js";
import Message from "../models/Message.js";

const postLoginOpts = {
  schema: {
    body: User,
    response: {
      500: Message,
      404: Message,
      401: Message,
      200: Message,
    },
  },
  handler: loginUser,
};

const getUserOpts = {
  schema: {
    response: {
      500: Message,
      404: Message,
      401: Message,
      200: UserView,
    },
  },
  preHandler: authorize,
  handler: getUserInfo,
};

const postRegisterOpts = {
  schema: {
    body: UserExt,
    response: {
      500: Message,
      409: Message,
      400: Message,
      200: Message,
    },
  },
  handler: registerUser,
};

const authRoutes = (app, options, done) => {
  //Get all
  app.get("/check-logged-in", { preHandler: authorize }, async (req, reply) => {
    reply.code(200).send(true);
  });

  app.delete("/logout", async (req, reply) => {
    await logout();
  });

  app.get("/userInfo", getUserOpts);

  app.post("/register", postRegisterOpts);

  app.post("/login", postLoginOpts);

  done();
};

export { authRoutes };
