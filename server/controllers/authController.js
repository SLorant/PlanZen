import {
  loginUserService,
  registerUserService,
  authorizeService,
  logoutService,
  getUserInfoService,
} from "../services/authService.js";

const loginUser = async (req, reply) => {
  const { username, password } = req.body;

  try {
    const isSuccess = await loginUserService(username, password);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const registerUser = async (req, reply) => {
  const { username, email, password, passwordConfirm } = req.body;

  try {
    const isSuccess = await registerUserService(username, email, password, passwordConfirm);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const getUserInfo = async (req, reply) => {
  try {
    const user = await getUserInfoService();
    reply.code(200).send(user);
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const authorize = async (req, reply, done) => {
  try {
    const isLoggedIn = await authorizeService();
    //req.user = user;
    return isLoggedIn;
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const logout = async (req, reply, done) => {
  try {
    const isSuccess = await logoutService();
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

export { loginUser, registerUser, authorize, logout, getUserInfo };
