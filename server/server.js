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

const authenticateToken = (req, reply) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return reply.code(401).send(true);

  // eslint-disable-next-line no-undef
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return reply.code(403).send(err);
    req.user = user;
    reply.send(posts.filter((post) => post.username === req.user.name));
  });
};

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

const updateItemOpts = {
  schema: {
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            username: { type: "string" },
            title: { type: "string" },
          },
        },
      },
      401: { type: "boolean" },
      403: { type: "string" },
    },
  },
  handler: authenticateToken,
};

const itemRoutes = (app, options, done) => {
  //Get all
  app.get("/users", async (req, reply) => {
    reply.send({ users: ["user1", "user2", "user3"] });
  });

  app.get("/posts", updateItemOpts);

  app.post("/login", async (req, reply) => {
    //auth
    const username = req.body.username;
    const password = req.body.password;
    const user = { name: username, password: password };
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
