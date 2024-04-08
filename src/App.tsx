import { useState, useEffect } from "react";
import "./App.css";
import { Card, CardBody, CardHeader, Stack, Box, Heading, Text, StackDivider } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import axios from "axios";

function App() {
  const [dailyQuote, setQuote] = useState("");

  useEffect(() => {
    try {
      fetchDailyQuote();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchQuote = async () => {
    try {
      let quote = await fetchNewQuote();
      while (quote.length > 100) {
        quote = await fetchNewQuote();
      }
      const postQuote = quote.quote;
      const author = quote.author;
      await axios.post(
        "http://localhost:4000/newquote",
        {
          postQuote,
          author,
        },
        {
          withCredentials: true,
        }
      );
      setQuote(quote.quote);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDailyQuote = async () => {
    try {
      const response = await axios.get("http://localhost:4000/dailyquote", {
        withCredentials: true,
      });
      const quote = response.data;
      const date = new Date(quote.updated);
      const today = new Date();
      const isNotToday =
        date.getFullYear() !== today.getFullYear() ||
        date.getMonth() !== today.getMonth() ||
        date.getDate() !== today.getDate();
      if (isNotToday) {
        fetchQuote();
      } else {
        setQuote(quote.quote);
      }
      // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    } catch (e) {
      console.log(e);
    }
  };

  const fetchNewQuote = async () => {
    try {
      const res = await fetch("https://api.api-ninjas.com/v1/quotes?category=inspirational", {
        headers: {
          "X-Api-Key": import.meta.env.VITE_QUOTES_API_KEY,
        },
      });
      const quotes = await res.json();
      const quote = quotes[0];
      console.log(quote);
      return quote;
    } catch {
      setQuote("asd");
    }
  };

  return (
    <main>
      <h1>Vite + React</h1>
      {dailyQuote && dailyQuote.toString()}
      <div className="card">
        <Link to={"/calendar"}>Calendar</Link>
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
