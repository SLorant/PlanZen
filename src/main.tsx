import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import RandomRoute from "./components/auth/Logout.tsx";
import Register from "./components/auth/Register.tsx";
import Login from "./components/auth/Login.tsx";
import Calendar2 from "./pages/Calendar.tsx";
import theme from "./theme.js";
import { ColorModeScript } from "@chakra-ui/react";
import Tasks from "./pages/Tasks.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/route",
    element: <RandomRoute />,
  },
  {
    path: "/calendar",
    element: <Calendar2 />,
  },
  {
    path: "/tasks",
    element: <Tasks />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  /*  <React.StrictMode> */
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <RouterProvider router={router} />
  </ChakraProvider>
);
