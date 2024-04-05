import { useState, useEffect } from "react";
import "./App.css";
import { Card, CardBody, CardHeader, Stack, Box, Heading, Text, StackDivider } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  const [backend, setBackend] = useState({});

  /*   useEffect(() => {
    try {
      fetchData();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchData = async () => {
    const res = await fetch("http://localhost:5000/api", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const js = await res.json();
    setBackend(js);
    console.log(js);
  }; */

  return (
    <main>
      <h1>Vite + React</h1>
      <p>{backend?.users?.toString() ?? "Loading.."}</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <Link to={"/register"}>register</Link>
      <Link to={"/login"}>login</Link>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      <Card color={"whiteAlpha.800"} backgroundColor="gray.700">
        <CardHeader>
          <Heading size="md">Client Report</Heading>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Summary
              </Heading>
              <Text pt="2" fontSize="sm">
                View a summary of all your clients over the last month.
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Overview
              </Heading>
              <Text pt="2" fontSize="sm">
                Check out the overview of your clients.
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Analysis
              </Heading>
              <Text pt="2" fontSize="sm">
                See a detailed analysis of all your business clients.
              </Text>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </main>
  );
}

export default App;
