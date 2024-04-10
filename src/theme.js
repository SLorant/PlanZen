import { extendTheme } from "@chakra-ui/react";
import "@fontsource/lato";
import "@fontsource/nunito";

const theme = {
  styles: {
    global: (props) => ({
      "html, body": {
        color: props.colorMode === "dark" ? "#e1e1e1" : "#292929",
        background: props.colorMode === "dark" ? "#141f1d" : "#f0f4f3",
      },
    }),
  },
  fonts: {
    heading: '"Nunito", sans-serif',
    body: '"Nunito", sans-serif',
  },
  colors: {
    light: {
      text: "#292929",
      bg: "#f0f4f3",
      primary: "#43e56e",
      secondary: "#9cf971",
      accent: "#479467",
    },
    dark: {
      text: "#e1e1e1",
      bg: "#141f1d",
      primary: "#19bc8b",
      secondary: "#82d1a6",
      accent: "#1e2723",
    },
  },
};

export default extendTheme(theme);
