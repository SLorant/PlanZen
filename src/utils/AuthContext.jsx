import React, { createContext, useState, useEffect } from "react";
import LoginCheckUtil from "./LoginCheckUtil";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userID, setUserID] = useState(false);

  /*  useEffect(() => {
    const checkLoggedIn = async () => {
      const loginResult = await loginCheck();
      if (loginResult.value) {
        setLoggedIn(loginResult.value);
      }
    };

    checkLoggedIn();
  }, []);

  const loginCheck = async () => {
    const result = await LoginCheckUtil();
    return result;
  }; */

  return <AuthContext.Provider value={{ userID, setUserID }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
