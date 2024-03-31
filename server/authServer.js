import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifyCors from "@fastify/cors";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import bcrypt from "bcrypt";

const app = fastify({ logger: true });
configDotenv.apply();

app.register(fastifySwagger, {
  exposeRoute: true,
  routePrefix: "/docs",
  swagger: {
    info: { title: "fastify-api" },
  },
});

let refreshTokens = [];
const users = [];

const itemRoutes = (app, options, done) => {
  //Get all

  app.delete("/logout", async (req, reply) => {
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
    reply.code(204).send("success");
  });

  app.post("/token", async (req, reply) => {
    const refreshToken = req.body.token;
    if (refreshToken === null) return reply.code(401).send(true);
    if (!refreshTokens.includes(refreshToken)) return reply.code(403).send(false);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return reply.code(403).send(false);
      const accessToken = generateAccessToken({ name: user.name });
      reply.send({ accessToken: accessToken });
    });
  });

  app.post("/register", async (req, reply) => {
    //auth
    try {
      // ide kell majd egy-két check passwordre stb., illetve egy alapvető frontend check is kell majd
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const username = req.body.username;
      const user = { name: username, password: hashedPassword };
      //itt lesz elmentve a user az adatbázisba
      users.push(user);

      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      //refreshtoken, accesstokent is le kell menteni, http only cookieba???????????
      refreshTokens.push(refreshToken);
      reply.send({ accessToken: accessToken, refreshToken: refreshToken, password: hashedPassword });
    } catch (e) {
      console.log(e);
    }
  });

  app.post("/users/login", async (req, reply) => {
    console.log(users);
    const user = users.find((user) => user.name === req.body.username);
    console.log(user);
    if (user === null) reply.code(400).send("cant find user");
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        reply.send("success");
      } else {
        reply.send("not allow");
      }
    } catch (e) {
      reply.code(500).send(e.toString());
    }
  });

  done();
};

app.register(itemRoutes, {});
app.register(fastifyCors);

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}

const PORT = 4000;

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
