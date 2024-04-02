import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifyCors from "@fastify/cors";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import bcrypt from "bcrypt";
import fastifyCookie from "@fastify/cookie";
import { authenticate, loginUser, registerUser } from "./controllers/auth.js";

const app = fastify({ logger: true });
configDotenv.apply();
const PORT = 4000;

app.register(fastifySwagger, {
  exposeRoute: true,
  routePrefix: "/docs",
  swagger: {
    info: { title: "fastify-api" },
  },
});

app.register(fastifyCookie, {
  secret: process.env.ACCESS_TOKEN_SECRET, // for cookies signature
  hook: "onRequest", // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  parseOptions: {},
});

app.register(fastifyCors, {
  origin: "http://localhost:5173",
  credentials: true,
});

// Middleware to check if the user is authenticated

const postLoginOpts = {
  schema: {
    body: {
      type: "object",
      required: ["name"],
      required: ["password"],
      properties: {
        name: { type: "string" },
        password: { type: "string" },
      },
    },
    response: {
      500: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      400: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  handler: loginUser,
};

const postRegisterOpts = {
  schema: {
    body: {
      type: "object",
      required: ["name"],
      required: ["password"],
      properties: {
        name: { type: "string" },
        password: { type: "string" },
      },
    },
    response: {
      500: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      400: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      200: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  handler: registerUser,
};

const authRoutes = (app, options, done) => {
  //Get all
  app.get("/protected-route", { preHandler: authenticate }, async (req, reply) => {
    reply.send("Protected route accessed successfully!");
  });

  app.delete("/logout", async (req, reply) => {
    // Clear the access token cookie
    reply.clearCookie("access_token").code(204).send("success");
  });

  app.post("/register", postRegisterOpts);

  app.post("/login", postLoginOpts);

  done();
};

app.register(authRoutes);

const start = async () => {
  try {
    await app.listen({ port: PORT });
    console.log("Server started");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};
start();
