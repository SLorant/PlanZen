import Api409Error from "../utils/errors/api409Error.js";
import Api401Error from "../utils/errors/api401Error.js";
import Api404Error from "../utils/errors/api404Error.js";
import Api500Error from "../utils/errors/api404Error.js";
import pb from "../database/SingletonDB.js";

async function loginUserService(username, password) {
  try {
    await pb.collection("users").getFirstListItem(`username="${username}"`);
  } catch (e) {
    throw new Api404Error("Username not found");
  }
  try {
    await pb.collection("users").authWithPassword(username, password);
  } catch (e) {
    throw new Api401Error("Password is invalid");
  }

  return pb.authStore.isValid;
}

async function registerUserService(username, email, password, passwordConfirm) {
  const user = { username: username, email: email, password: password, passwordConfirm: passwordConfirm };

  //Check if username exists
  try {
    const existingUser = await pb.collection("users").getFirstListItem(`username="${username}"`);
    if (existingUser) {
      throw new Api409Error("This username already exists.");
    }
  } catch (e) {
    handleConflictError(e);
  }

  //Check if username exists
  try {
    const existingEmail = await pb.collection("users").getFirstListItem(`email="${email}"`);
    if (existingEmail) {
      throw new Api409Error("This email already exists.");
    }
  } catch (e) {
    handleConflictError(e);
  }

  //Create the user
  try {
    await pb.collection("users").create({
      ...user,
    });
    await pb.collection("users").authWithPassword(username, password);
  } catch (e) {
    throw new Api500Error("Something went wrong.");
  }

  return pb.authStore.isValid;
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

async function authorizeService() {
  try {
    pb.authStore.isValid && (await pb.collection("users").authRefresh());
  } catch (e) {
    pb.authStore.clear();
  }
  if (!pb.authStore.isValid) {
    throw new Api401Error("Unauthorized: User not logged in");
  }

  return pb.authStore.isValid;
}

async function refreshToken() {
  await pb.collection("users").authRefresh();
}

export { loginUserService, registerUserService, authorizeService, refreshToken };
