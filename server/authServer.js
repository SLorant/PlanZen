import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifyCors from "@fastify/cors";
import { configDotenv } from "dotenv";
import fastifyCookie from "@fastify/cookie";
import { authRoutes } from "./routes/authRoutes.js";

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
