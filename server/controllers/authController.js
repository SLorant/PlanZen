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
    reply.code(e.status).send(e.name);
  }
};

const registerUser = async (req, reply) => {
  const { username, email, password } = req.body;

  try {
    const accessToken = await registerUserService(username, email, password);
    reply
      .setCookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 30 * 24 * 60 * 60,
      })
      .send({ accessToken });
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const authorize = async (req, reply, done) => {
  try {
    const user = authorizeService(req);
    req.user = user;
    done();
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

export { loginUser, registerUser, authorize };
