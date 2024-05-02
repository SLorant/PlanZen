import { useState, useEffect, useContext } from "react";
import "./App.css";
import { Card, CardBody, CardHeader, Heading, Text, VStack, SimpleGrid, CardFooter, Box, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useColorMode, Button } from "@chakra-ui/react";
import Wrapper from "./components/Wrapper";
import SideMenu from "./components/SideMenu";
import { MoonIcon } from "@chakra-ui/icons";
import QuoteAdder from "./components/QuoteAdder";
import LoginCheckUtil from "./utils/LoginCheckUtil";
import { AuthContext } from "./utils/AuthContext";

function App() {
  const [dailyQuote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const { toggleColorMode } = useColorMode();
  /*  const { setLoggedIn } = useContext(AuthContext);
   */
  useEffect(() => {
    try {
      checkLoggedIn();
      QuoteAdder({ setAuthor, setQuote });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const checkLoggedIn = async () => {
    const result = await LoginCheckUtil();
    /* if (result) {
      setLoggedIn(true);
    } */
  };

  return (
    <Wrapper>
      <SideMenu />
      <Heading mt={[7, 0]} as={"h1"} size={"2xl"} textAlign={"center"}>
        PlanZen
      </Heading>

      <Button
        position={"absolute"}
        colorScheme="secondary"
        textColor={"darktext"}
        top={6}
        right={[6, "30px"]}
        size="sm"
        height={"40px"}
        width={"44px"}
        onClick={toggleColorMode}
      >
        <MoonIcon boxSize={5} />
      </Button>
      {dailyQuote && author && (
        <Flex justifyContent={"center"} placeItems={"center"}>
          <Box width={"max-content"} mt={10} textAlign={"center"} fontSize={["lg", "2xl"]} fontWeight={"bold"}>
            {dailyQuote}
            <Heading mt={0} textAlign={"end"} size={["xs", "sm"]}>
              &mdash; {author}
            </Heading>
          </Box>
        </Flex>
      )}
      <VStack className="card" alignItems={"start"} mt={[2, 6]}>
        <Text textAlign={"start"} fontSize={["xl", "2xl"]}>
          What are you up to today?
        </Text>
        <SimpleGrid
          width={"100%"}
          spacing={4}
          templateColumns={["repeat(auto-fill, minmax(150px, 1fr))", "repeat(auto-fill, minmax(200px, 1fr))"]}
        >
          <Card>
            <CardHeader>
              <Heading size="md"> Calendar</Heading>
            </CardHeader>
            <CardBody>
              <Text>See upcoming events or plan your schedule</Text>
            </CardBody>
            <CardFooter>
              <Link to={"/calendar"}>
                <Button _hover={{ backgroundColor: "secondary.500" }} colorScheme="primary" textColor={"darktext"}>
                  Calendar
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Heading size="md"> Tasks</Heading>
            </CardHeader>
            <CardBody>
              <Text>Don't forget your daily tasks</Text>
            </CardBody>
            <CardFooter>
              <Link to={"/tasks"}>
                <Button _hover={{ backgroundColor: "secondary.500" }} textColor={"darktext"} colorScheme="primary">
                  View tasks
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Heading size="md"> Meditation</Heading>
            </CardHeader>
            <CardBody>
              <Text>Relax. You need it.</Text>
            </CardBody>
            <CardFooter>
              <Link to={"/meditation"}>
                <Button _hover={{ backgroundColor: "secondary.500" }} textColor={"darktext"} colorScheme="primary">
                  Meditate
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Heading size="md"> Habit tracker [WIP]</Heading>
            </CardHeader>
            <CardBody>
              <Text>Habit tracker </Text>
            </CardBody>
            <CardFooter>
              <Link to={"/tasks"}>
                <Button
                  _hover={{ backgroundColor: "secondary.500" }}
                  textColor={"darktext"}
                  isDisabled={true}
                  colorScheme="primary"
                >
                  Check habits
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </SimpleGrid>
      </VStack>
      {/*  <Link to={"/register"}>register</Link>
      <Link to={"/login"}>login</Link> */}
    </Wrapper>
  );
}

export default App;

/*   {dailyQuote && author && (
        <Stack direction="column" spacing={0}>
          <Heading mt={10} textAlign="end" size="lg">
            {dailyQuote}
          </Heading>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Text flex="1" mt={2} textAlign="end" size="md">
              - {author}
            </Text>
          </Stack>
        </Stack>
      )} */
