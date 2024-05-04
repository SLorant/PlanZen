import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Register from "./components/auth/Register.jsx";
import Login from "./components/auth/Login.jsx";
import Calendar2 from "./pages/Calendar.jsx";
import theme from "./theme.js";
import { ColorModeScript } from "@chakra-ui/react";
import Tasks from "./pages/Tasks.jsx";
import Meditation from "./pages/Meditation.jsx";
import { PocketProvider } from "./contexts/PocketContext";

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
    path: "/calendar",
    element: <Calendar2 />,
  },
  {
    path: "/tasks",
    element: <Tasks />,
  },
  {
    path: "/meditation",
    element: <Meditation />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  /*  <React.StrictMode> */
  <ChakraProvider theme={theme}>
    <PocketProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <RouterProvider router={router} />
    </PocketProvider>
  </ChakraProvider>
);
