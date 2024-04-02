import { useState, useEffect } from "react";
import "./App.css";
import { Card, CardBody, Text } from "@chakra-ui/react";
import Register from "./components/Register";

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
    <>
      <h1>Vite + React</h1>
      <p>{backend?.users?.toString() ?? "Loading.."}</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <Register />
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      <Card>
        <CardBody>
          <Text>View a summary of all your customers over the last month.</Text>
        </CardBody>
      </Card>
    </>
  );
}

export default App;
