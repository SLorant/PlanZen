import { authorize, loginUser, registerUser } from "../controllers/authController.js";
import { User, UserExt } from "../models/User.js";
import Message from "../models/Message.js";

const postLoginOpts = {
  schema: {
    body: User,
    response: {
      500: Message,
      400: Message,
      200: Message,
    },
  },
  handler: loginUser,
};

const postRegisterOpts = {
  schema: {
    body: UserExt,
    response: {
      500: Message,
      400: Message,
      200: Message,
    },
  },
  handler: registerUser,
};

const authRoutes = (app, options, done) => {
  //Get all
  app.get("/protected-route", { preHandler: authorize }, async (req, reply) => {
    reply.send("Protected route accessed successfully!");
  });

  app.delete("/logout", async (req, reply) => {
    reply.clearCookie("access_token").code(204).send("success");
  });

  app.post("/register", postRegisterOpts);

  app.post("/login", postLoginOpts);

  done();
};

export { authRoutes };
