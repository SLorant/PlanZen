import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import PocketBase from "pocketbase";
import adminLogin from "./adminLogin.js";
import Api409Error from "../utils/errors/api409Error.js";
import Api401Error from "../utils/errors/api401Error.js";
import Api404Error from "../utils/errors/api404Error.js";
import Api500Error from "../utils/errors/api404Error.js";

const pb = new PocketBase("http://127.0.0.1:8090");
const users = [];

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

async function loginUserService(username, password) {
  // const user = users.find((user) => user.name === username);

  const user = await pb.collection("users2").getFirstListItem(`username="${username}"`, {
    expand: "username,password",
  });

  if (!user) {
    throw new Api404Error("User with this username not found.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Api401Error("Password is invalid.");
  }

  const accessToken = generateAccessToken(user);
  return accessToken;
}

async function registerUserService(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username: username, email: email, password: hashedPassword };

  await adminLogin(pb);

  try {
    const existingUser = await pb.collection("users2").getFirstListItem(`username="${username}"`);
    if (existingUser) {
      throw new Api409Error("This username already exists.");
    }
  } catch (e) {
    handleConflictError(e);
  }

  try {
    const existingEmail = await pb.collection("users2").getFirstListItem(`email="${email}"`);
    if (existingEmail) {
      throw new Api409Error("This email already exists.");
    }
  } catch (e) {
    handleConflictError(e);
  }

  try {
    await pb.collection("users2").create({
      ...user,
    });
  } catch (e) {
    throw new Api500Error("Something went wrong.");
  }

  const accessToken = generateAccessToken(user);
  return accessToken;
}

function handleConflictError(e) {
  if (e.status === 404) {
    // User or email not found in db, continue with registration
    return;
  } else if (e.status === 409) {
    throw e; // Rethrow the 409 error
  } else {
    throw new Api500Error("Unexpected error occurred.");
  }
}

function authorizeService(req) {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    throw new Api401Error("Unauthorized: Access token is missing");
  }
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
}

export { loginUserService, registerUserService, authorizeService };
