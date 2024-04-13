import React from "react";
import { Center, Container, useColorModeValue } from "@chakra-ui/react";

const Wrapper = (props) => {
  const color = useColorModeValue("e1e1e1", "191919");
  const color2 = useColorModeValue("#eee", "#222");
  return (
    <Center width={"100vw"} height={"100vh"} backgroundColor={`${color2}`}>
      <Container
        backgroundColor={"bg"}
        maxW={"container.lg"}
        marginBottom={"10vh"}
        padding={[0, 30]}
        boxShadow={["", `5px 5px 10px 3px #${color}`]}
        borderRadius={10}
      >
        {props.children}
      </Container>
    </Center>
  );
};

export default Wrapper;
