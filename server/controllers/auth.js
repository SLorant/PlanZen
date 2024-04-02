import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const users = [];

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

const loginUser = async (req, reply) => {
  const user = users.find((user) => user.name === req.body.username);
  if (user === undefined) {
    reply.code(400).send("User not found");
    return;
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = generateAccessToken(user);
      // Set the access token as an HttpOnly cookie
      reply.setCookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60,
      }); // 30 days expiration
      reply.send({ accessToken: accessToken });
    } else {
      reply.send("Invalid password");
    }
  } catch (e) {
    reply.code(500).send(e.toString());
  }
};

const registerUser = async (req, reply) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const username = req.body.username;
    const user = { name: username, password: hashedPassword };
    users.push(user);

    const accessToken = generateAccessToken(user);
    // Set the access token as an HttpOnly cookie
    reply
      .setCookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 30 * 24 * 60 * 60,
      })
      .send({ accessToken: accessToken });
  } catch (e) {
    reply.code(500).send(e.toString());
  }
};

const authenticate = async (req, reply, done) => {
  try {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      reply.code(401).send("Unauthorized: Access token is missing");
      return;
    }
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    done();
  } catch (error) {
    reply.code(401).send(error);
  }
};

export { loginUser, registerUser, authenticate };
