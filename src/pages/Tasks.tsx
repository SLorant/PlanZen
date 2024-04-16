import {
  Box,
  Button,
  Card,
  CardBody,
  Collapse,
  Flex,
  Heading,
  Text,
  useDisclosure,
  ScaleFade,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import SideMenu from "../components/SideMenu";
import { AddIcon, CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import AddTask from "../components/AddTask";
import LoginCheckUtil from "../utils/LoginCheckUtil";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";

const Tasks = () => {
  /*  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true }); */

  const [allTasks, setAllTasks] = useState([]);
  const [loggedIn /* setLoggedIn */] = useState(false);
  const [collapseStates, setCollapseStates] = useState([]);
  const [fadeStates, setFadeStates] = useState({});
  const toast = useToast();

  useEffect(() => {
    try {
      fetchAllTasks();
    } catch (e) {
      console.error(e?.response?.data);
    }
  }, [loggedIn]);

  const fetchAllTasks = async () => {
    const loginResult = await LoginCheckUtil();
    if (loginResult) {
      try {
        const result = await axios.get("http://localhost:4000/tasks", {
          withCredentials: true,
        });

        const tasks = result?.data.items;
        console.log(result?.data.items);
        for (const task of tasks) {
          if (task.isEvent && task.id) {
            const event = await axios.post(
              "http://localhost:4000/getEventByTask",
              { taskID: task.id },
              {
                withCredentials: true,
              }
            );
            console.log(event);
            task.start = event?.data?.start;
            task.end = event?.data?.end;
            /*   console.log(moment(task.start).isBefore());
            console.log(moment(task.start).isBefore(moment(), "day")); */
            const startDate = moment(event?.data?.start);
            const endDate = moment(event?.data?.end);
            const tomorrow = moment().add(1, "days");
            const yesterday = moment().subtract(1, "days");
            // Compare task start date with today and tomorrow

            console.log(!moment(task.start).isBefore(moment(), "day"));
            if (!moment(task.start).isBefore(moment(), "day") && !moment(task.start).isAfter(moment(), "day")) {
              task.day = "Today";
            } else if (!moment(task.start).isBefore(tomorrow, "day") && !moment(task.start).isAfter(tomorrow, "day")) {
              task.day = "Tomorrow";
            } else if (
              !moment(task.start).isBefore(yesterday, "day") &&
              !moment(task.start).isAfter(yesterday, "day")
            ) {
              task.day = "Yesterday";
            }
            task.start = startDate.format("HH:mm");
            task.end = endDate.format("HH:mm");
          }
        }
        setAllTasks(tasks);
        /*  setFadeStates(new Array(tasks.length).fill(true)); */
        setFadeStates(
          tasks.reduce((acc, task) => {
            acc[task.id] = true;
            return acc;
          }, {})
        );
        setCollapseStates(new Array(tasks.length).fill(false));
      } catch (e) {
        console.log(e);
        console.log(e?.response?.data);
      }
    }
  };

  const toggleCollapse = (index) => {
    setCollapseStates((prevStates) => {
      const newState = [...prevStates];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const deleteTask = async (taskID) => {
    const result = await LoginCheckUtil();
    if (result && taskID) {
      try {
        await axios.delete(
          "http://localhost:4000/deleteTask",
          {
            data: { id: taskID },
          },
          {
            withCredentials: true,
          }
        );
      } catch (e) {
        console.log(e?.response?.data);
      }
    }
  };

  const taskDone = async (taskID, isDone) => {
    const result = await LoginCheckUtil();
    if (result && taskID) {
      try {
        await axios.post(
          "http://localhost:4000/taskDone",
          {
            data: { id: taskID, isDone: isDone },
          },
          {
            withCredentials: true,
          }
        );
      } catch (e) {
        console.log(e?.response?.data);
      }
    }
  };

  const toggleDone = async (task) => {
    if (task.isRecurring) {
      const isDone = !task.isDone;
      await taskDone(task.id, isDone);
      const updatedTask = { ...task, isDone };
      setAllTasks((prevTasks) => {
        const index = prevTasks.findIndex((item) => item.id === task.id);

        if (index === -1) {
          // Task not found, return previous tasks
          return prevTasks;
        }

        // Create a new array with the updated task at the same index
        const updatedTasks = [
          ...prevTasks.slice(0, index), // Items before the updated task
          updatedTask, // Updated task
          ...prevTasks.slice(index + 1), // Items after the updated task
        ];

        return updatedTasks;
      });
    } else {
      await deleteTask(task.id);
      setFadeStates((prevStates) => ({
        ...prevStates,
        [task.id]: false,
      }));

      await new Promise((resolve) => setTimeout(resolve, 300)); // Adjust the delay as needed

      setAllTasks((prevTasks) => {
        const filtered = prevTasks.filter((item) => item.id !== task.id);
        return [...filtered];
      });
    }
  };

  return (
    <Wrapper>
      <SideMenu />
      <Heading textAlign={"center"} mt={4}>
        Tasks
      </Heading>
      <AddTask fetchTasks={fetchAllTasks} />
      <Box padding={6} maxHeight={["auto", "40vh"]} overflow={"scroll"}>
        {allTasks &&
          allTasks.map((task, index) => (
            <ScaleFade initialScale={0.9} in={fadeStates[task.id]} key={index}>
              <Card mt={6}>
                <CardBody padding={4}>
                  <Box>
                    <Flex justifyContent={"space-between"} alignItems={"center"}>
                      <Text textDecorationLine={`${task.isDone ? "line-through" : ""}`} fontSize={"xl"}>
                        {task.name}
                      </Text>

                      <Flex justifyContent={"end"} alignItems={"center"} gap={4}>
                        <Button size={"sm"} onClick={() => toggleCollapse(index)}>
                          <AddIcon />
                        </Button>
                        <Button
                          size={"sm"}
                          colorScheme="primary"
                          onClick={() => toggleDone(task, index)}
                          _hover={{ backgroundColor: "secondary.500" }}
                        >
                          <CheckIcon />
                        </Button>
                      </Flex>
                    </Flex>
                    <Box>
                      <Collapse
                        in={collapseStates[index]}
                        transition={{ /* exit: { delay: 1 }, */ enter: { duration: 0.3 } }}
                      >
                        <Box p="20px" color="text" mt="4" backgroundColor={"bg"} rounded="md" shadow="md">
                          {task.start && task.end && task.day && (
                            <Text color={"secondaryNoScheme"} fontSize={["sm", "lg"]}>
                              {task.day} {task.start}-{task.end}
                            </Text>
                          )}
                          <Text>{task.description}</Text>
                        </Box>
                        {task.isEvent && (
                          <Link to="/calendar">
                            <Button mt={6}>
                              Check related event <ExternalLinkIcon mx="5px" />
                            </Button>
                          </Link>
                        )}
                      </Collapse>
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            </ScaleFade>
          ))}
      </Box>
    </Wrapper>
  );
};

export default Tasks;
