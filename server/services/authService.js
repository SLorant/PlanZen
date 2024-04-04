import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import PocketBase from "pocketbase";
import adminLogin from "./adminLogin.js";

const pb = new PocketBase("http://127.0.0.1:8090");
const users = [];

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

async function loginUserService(username, password) {
  const user = users.find((user) => user.name === username);
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const accessToken = generateAccessToken(user);
  return accessToken;
}

async function registerUserService(username, email, password, birthdate) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { username: username, email: email, password: hashedPassword, birthdate: birthdate };
  await adminLogin(pb);
  const record = await pb.collection("users2").create({
    ...user,
  });
  console.log(record);

  const accessToken = generateAccessToken(user);
  return accessToken;
}

function authorizeService(req) {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    throw new Error("Unauthorized: Access token is missing");
  }
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
}

export { loginUserService, registerUserService, authorizeService };
