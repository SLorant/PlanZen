import { useState, useEffect } from "react";
import "./App.css";
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  CardFooter,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useColorMode, Button } from "@chakra-ui/react";
import Wrapper from "./components/Wrapper";
import SideMenu from "./components/SideMenu";
import { MoonIcon } from "@chakra-ui/icons";
import QuoteAdder from "./components/QuoteAdder";

function App() {
  const [dailyQuote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const { toggleColorMode } = useColorMode();
  useEffect(() => {
    try {
      QuoteAdder({ setAuthor, setQuote });
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <Wrapper>
      <SideMenu />
      <Heading mt={[10, 0]} size={"2xl"} textAlign={"center"}>
        Logo
      </Heading>

      <Button
        position={"absolute"}
        colorScheme="secondary"
        textColor={"darktext"}
        top={4}
        right={4}
        size="sm"
        onClick={toggleColorMode}
      >
        <MoonIcon boxSize={4} />
      </Button>
      {dailyQuote && author && (
        <>
          <Heading
            as={"h2"}
            mt={10}
            textAlign={"center"}
            size={["md", "lg"]}
            fontWeight={"bold"}
          >
            {dailyQuote}
          </Heading>

          <Heading mt={2} textAlign={"center"} size={["sm", "md"]}>
            &mdash; {author}
          </Heading>
        </>
      )}
      <VStack className="card" alignItems={"start"} mt={[2, 6]}>
        <Text textAlign={"start"} fontSize={["xl", "2xl"]}>
          What do you want to do?
        </Text>
        <SimpleGrid
          width={"100%"}
          spacing={4}
          templateColumns={[
            "repeat(auto-fill, minmax(150px, 1fr))",
            "repeat(auto-fill, minmax(200px, 1fr))",
          ]}
        >
          <Card>
            <CardHeader>
              <Heading size="md"> Calendar</Heading>
            </CardHeader>
            <CardBody>
              <Text>View a </Text>
            </CardBody>
            <CardFooter>
              <Link to={"/calendar"}>
                <Button colorScheme="primary" textColor={"text"}>
                  Calendar
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Heading size="md"> Customer dashboard</Heading>
            </CardHeader>
            <CardBody>
              <Text>View a s last month.</Text>
            </CardBody>
            <CardFooter>
              <Button colorScheme="primary">Calendar</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Heading size="md"> Tasks</Heading>
            </CardHeader>
            <CardBody>
              <Text>5 tasks remaining today</Text>
            </CardBody>
            <CardFooter>
              <Link to={"/tasks"}>
                <Button colorScheme="primary">See tasks..</Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Heading size="md"> Tasks</Heading>
            </CardHeader>
            <CardBody>
              <Text>5 tasks remaining today</Text>
            </CardBody>
            <CardFooter>
              <Link to={"/tasks"}>
                <Button colorScheme="primary">See tasks..</Button>
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
