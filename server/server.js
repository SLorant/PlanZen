import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifyCors from "@fastify/cors";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

const app = fastify({ logger: true });
configDotenv.apply();

app.register(fastifySwagger, {
  exposeRoute: true,
  routePrefix: "/docs",
  swagger: {
    info: { title: "fastify-api" },
  },
});

const posts = [
  {
    username: "Vki",
    title: "Post 1",
  },
  {
    username: "Masodik",
    title: "Post 2",
  },
];

const authenticateToken = (req, reply, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return reply.sendStatus(401);

  // eslint-disable-next-line no-undef
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return reply.sendStatus(403);
    req.user = user;
    next();
  });
};

const itemRoutes = (app, options, done) => {
  //Get all
  app.get("/api", async (req, reply) => {
    reply.send({ users: ["user1", "user2", "user3"] });
  });

  app.get("/posts", authenticateToken, (req, reply) => {
    reply.send(posts.filter((post) => post.username === req.user.name));
  });

  app.post("/login", async (req, reply) => {
    //auth
    const username = req.body.username;
    const user = { name: username };
    // eslint-disable-next-line no-undef
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    reply.send({ accessToken: accessToken });
  });

  done();
};

app.register(itemRoutes, {});
app.register(fastifyCors);
const PORT = 5000;

const start = async () => {
  try {
    await app.listen({ port: PORT });
    console.log("Server sstarted");
  } catch (error) {
    app.log.error(error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};
start();
