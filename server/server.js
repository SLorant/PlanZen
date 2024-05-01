import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifyCors from "@fastify/cors";
import { configDotenv } from "dotenv";
import fastifyCookie from "@fastify/cookie";
import { authRoutes } from "./routes/authRoutes.js";
import { miscRoutes } from "./routes/miscRoutes.js";
import { eventRoutes } from "./routes/eventRoutes.js";
import { taskRoutes } from "./routes/taskRoutes.js";

const app = fastify({ logger: false });
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
  secret: process.env.ACCESS_TOKEN_SECRET,
  hook: "onRequest",
  parseOptions: {},
});

app.register(fastifyCors, {
  origin: "http://localhost:5173",
  credentials: true,
});

app.register(authRoutes);
app.register(miscRoutes);
app.register(eventRoutes);
app.register(taskRoutes);

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
