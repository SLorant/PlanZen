import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifyCors from "@fastify/cors";
import { configDotenv } from "dotenv";
import { authRoutes } from "./routes/authRoutes.js";
import { miscRoutes } from "./routes/miscRoutes.js";
import { eventRoutes } from "./routes/eventRoutes.js";
import { taskRoutes } from "./routes/taskRoutes.js";

const app = fastify({ logger: false });
configDotenv.apply();
const port = process.env.PORT || 4000;
const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;

app.register(fastifySwagger, {
  exposeRoute: true,
  routePrefix: "/docs",
  swagger: {
    info: { title: "fastify-api" },
  },
});

app.register(fastifyCors, {
  origin: "*",
  credentials: true,
});

app.register(authRoutes);
app.register(miscRoutes);
app.register(eventRoutes);
app.register(taskRoutes);

const start = async () => {
  try {
    app.listen({ host: host, port: port });
    console.log("Server started");
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};
start();
