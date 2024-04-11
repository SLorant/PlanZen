import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import RandomRoute from "./components/RandomRoute.tsx";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";
import Calendar2 from "./pages/Calendar.tsx";
import ToDo from "./pages/ToDo.tsx";
import theme from "./theme.js";
import { ColorModeScript } from "@chakra-ui/react";

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
    path: "/todo",
    element: <ToDo />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  /*  <React.StrictMode> */
  <ChakraProvider theme={theme}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <RouterProvider router={router} />
  </ChakraProvider>
);
