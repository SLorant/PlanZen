import React from "react";
import { Center, Container, useColorModeValue } from "@chakra-ui/react";

const Wrapper = (props) => {
  const color = useColorModeValue("#e1e1e1", "rgba(0, 0, 0, 0.16)");
  const color2 = useColorModeValue("#eee", "gray.900");
  const bg = useColorModeValue("bg", "gray.800");
  return (
    <Center width={"100vw"} height={"100vh"} backgroundColor={`${color2}`}>
      <Container
        backgroundColor={bg}
        maxW={"container.lg"}
        height={["100vh", "auto"]}
        marginBottom={[0, "10vh"]}
        padding={[0, 30]}
        paddingTop={[0, 6]}
        boxShadow={["", `5px 5px 10px 3px ${color}`]}
        borderRadius={10}
        position={"relative"}
        overflow={"auto"}
      >
        {props.children}
      </Container>
    </Center>
  );
};

export default Wrapper;
