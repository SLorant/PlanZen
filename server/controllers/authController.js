import { loginUserService, registerUserService, authorizeService } from "../services/authService.js";

const loginUser = async (req, reply) => {
  const { username, password } = req.body;

  try {
    const accessToken = await loginUserService(username, password);
    reply.setCookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 30 * 24 * 60 * 60,
    });
    reply.send({ accessToken });
  } catch (e) {
    reply.code(400).send(e.message);
  }
};

const registerUser = async (req, reply) => {
  const { username, email, password, birthdate } = req.body;

  try {
    const accessToken = await registerUserService(username, email, password, birthdate);
    reply
      .setCookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 30 * 24 * 60 * 60,
      })
      .send({ accessToken });
  } catch (e) {
    console.log(e);
    reply.code(500).send(e.message);
  }
};

const authorize = async (req, reply, done) => {
  try {
    const user = authorizeService(req);
    req.user = user;
    done();
  } catch (e) {
    reply.code(401).send(e.message);
  }
};

export { loginUser, registerUser, authorize };
