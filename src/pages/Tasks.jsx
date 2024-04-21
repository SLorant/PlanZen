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
import {
  AddIcon,
  ArrowDownIcon,
  CheckIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import AddTask from "../components/tasks/AddTask";
import LoginCheckUtil from "../utils/LoginCheckUtil";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import DeleteTask from "../components/tasks/DeleteTask";

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
        console.log(tasks);
        for (const task of tasks) {
          if (task.isEvent && task.id) {
            const event = await axios.post(
              "http://localhost:4000/getEventByTask",
              { taskID: task.id },
              {
                withCredentials: true,
              }
            );
            task.start = event?.data?.start;
            task.end = event?.data?.end;
            task.color = event?.data?.color;
            /*   console.log(moment(task.start).isBefore());
            console.log(moment(task.start).isBefore(moment(), "day")); */
            const startDate = moment(event?.data?.start);
            const endDate = moment(event?.data?.end);
            const tomorrow = moment().add(1, "days");
            const yesterday = moment().subtract(1, "days");
            // Compare task start date with today and tomorrow

            if (
              !moment(task.start).isBefore(moment(), "day") &&
              !moment(task.start).isAfter(moment(), "day")
            ) {
              task.day = "Today";
            } else if (
              !moment(task.start).isBefore(tomorrow, "day") &&
              !moment(task.start).isAfter(tomorrow, "day")
            ) {
              task.day = "Tomorrow";
            } else if (
              !moment(task.start).isBefore(yesterday, "day") &&
              !moment(task.start).isAfter(yesterday, "day")
            ) {
              task.day = "Yesterday";
            }
            task.startTime = startDate.format("HH:mm");
            task.endTime = endDate.format("HH:mm");
          }
        }
        // Sort tasks based on the isDone status
        const sortedTasks = tasks.sort((a, b) => {
          // Tasks that are not done should appear before tasks that are done
          if (a.isDone === false && b.isDone === true) {
            return -1; // a should come before b
          } else if (a.isDone === true && b.isDone === false) {
            return 1; // b should come before a
          } else {
            return 0; // Leave order unchanged
          }
        });
        // Partition tasks into two groups: done and not done
        const doneTasks = sortedTasks
          .filter((task) => task.isDone)
          .sort((a, b) => new Date(b.updated) - new Date(a.updated));
        const notDoneTasks = sortedTasks
          .filter((task) => !task.isDone)
          .sort((a, b) => new Date(b.updated) - new Date(a.updated));

        // Concatenate sorted groups
        const finalSortedTasks = notDoneTasks.concat(doneTasks);

        setAllTasks(finalSortedTasks);
        /*  setFadeStates(new Array(tasks.length).fill(true)); */
        setFadeStates(
          tasks.reduce((acc, task) => {
            acc[task.id] = true;
            return acc;
          }, {})
        );
        setCollapseStates(new Array(tasks.length).fill(false));
      } catch (e) {
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
    const isDone = !task.isDone;
    await taskDone(task.id, isDone);
    setFadeStates(
      allTasks.reduce((acc, task) => {
        acc[task.id] = true;
        return acc;
      }, {})
    );
    fetchAllTasks();
    /*  setAllTasks((prevTasks) => {
      const index = prevTasks.findIndex((item) => item.id === task.id);

      if (index === -1) {
        // Task not found, return previous tasks
        return prevTasks;
      }
      const updatedTask = prevTasks[index];

      if (!updated.isDone) {
        // Create a new array with the updated task at the same index
        const updatedTasks = [
          ...prevTasks.slice(0, index), // Items before the updated task
          updated, // Updated task
          ...prevTasks.slice(index + 1), // Items after the updated task
        ];

        return updatedTasks;
      } else {
        const updatedTasks = prevTasks.filter((item, idx) => idx !== index);

        // Add the task to the end of the array
        updatedTasks.push({ ...updatedTask, isDone: updated.isDone });

        return updatedTasks;
      }
    }); */
    /*    fetchAllTasks(); */
    /*    await deleteTask(task.id);
      setFadeStates((prevStates) => ({
        ...prevStates,
        [task.id]: false,
      }));

      await new Promise((resolve) => setTimeout(resolve, 300)); // Adjust the delay as needed

      setAllTasks((prevTasks) => {
        const filtered = prevTasks.filter((item) => item.id !== task.id);
        return [...filtered];
      }); */
  };

  return (
    <Wrapper>
      <SideMenu />
      <Heading textAlign={"center"} mt={4}>
        Tasks
      </Heading>
      <AddTask tasks={allTasks} fetchTasks={fetchAllTasks} />
      <Box padding={6} maxHeight={["auto", "40vh"]} overflow={"scroll"}>
        {allTasks &&
          allTasks.map((task, index) => (
            <ScaleFade initialScale={0.9} in={fadeStates[task.id]} key={index}>
              <Card mt={6} backgroundColor={task.isDone ? "bg" : "gray.700"}>
                <CardBody padding={4}>
                  {task.isDone && (
                    <Box
                      position={"absolute"}
                      zIndex={50}
                      right={4}
                      top={5}
                      display={"flex"}
                      justifyContent={"center"}
                      placeItems={"center"}
                      gap={4}
                    >
                      <DeleteTask fetchTasks={fetchAllTasks} taskID={task.id} />
                      <Button
                        size={"sm"}
                        colorScheme="primary"
                        onClick={() => toggleDone(task, index)}
                        _hover={{ backgroundColor: "secondary.500" }}
                        padding={"7px"}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon icon-tabler icon-tabler-reload"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="#000000"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
                          <path d="M20 4v5h-5" />
                        </svg>
                      </Button>
                    </Box>
                  )}

                  <Box /*  opacity={task.isDone ? "1" : "1"} */>
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Button
                        variant={"unstyled"}
                        fontWeight={"normal"}
                        textDecorationLine={`${
                          task.isDone ? "line-through" : ""
                        }`}
                        fontSize={
                          task.name.length < 10
                            ? "xl"
                            : task.name.length < 25
                            ? "lg"
                            : "md"
                        }
                        onClick={() => toggleCollapse(index)}
                      >
                        <Text
                          textAlign={"left"}
                          whiteSpace={
                            "collapse"
                          } /* style={{ whiteSpace: "wrap" }} */
                        >
                          {task.name}
                        </Text>
                      </Button>

                      {!task.isDone && (
                        <Flex
                          justifyContent={"end"}
                          alignItems={"center"}
                          gap={3}
                        >
                          <Button
                            size={"sm"}
                            onClick={() => toggleCollapse(index)}
                            padding={"7px"}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="icon icon-tabler icon-tabler-arrow-down"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              stroke-width="2"
                              stroke="#000000"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M12 5l0 14" />
                              <path d="M18 13l-6 6" />
                              <path d="M6 13l6 6" />
                            </svg>
                          </Button>
                          <Button
                            size={"sm"}
                            colorScheme="primary"
                            onClick={() => toggleDone(task, index)}
                            _hover={{ backgroundColor: "secondary.500" }}
                            padding={"7px"}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="icon icon-tabler icon-tabler-check"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              stroke-width="2"
                              stroke="#000000"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <path d="M5 12l5 5l10 -10" />
                            </svg>
                          </Button>
                        </Flex>
                      )}
                    </Flex>
                    <Box>
                      <Collapse
                        in={collapseStates[index]}
                        transition={{
                          /* exit: { delay: 1 }, */ enter: { duration: 0.3 },
                        }}
                      >
                        <Box
                          p="20px"
                          color="text"
                          mt="4"
                          backgroundColor={"gray.800"}
                          rounded="md"
                          shadow="md"
                        >
                          {task.start && task.end && task.day && (
                            <Text
                              opacity={0.7}
                              color={"text"}
                              mb={2}
                              fontSize={["sm", "md"]}
                            >
                              {task.day} {task.startTime}-{task.endTime}
                            </Text>
                          )}
                          <Text>{task.description}</Text>
                        </Box>
                        <Flex alignItems={"center"} gap={6}>
                          {task.isEvent && (
                            <Box mt={6}>
                              <Link to="/calendar">
                                <Button>
                                  Calendar
                                  <ExternalLinkIcon mx="5px" />
                                </Button>
                              </Link>
                            </Box>
                          )}
                          <AddTask
                            tasks={allTasks}
                            fetchTasks={fetchAllTasks}
                            task={task}
                          />
                          {task?.isRecurring && (
                            <DeleteTask
                              fetchTasks={fetchAllTasks}
                              taskID={task.id}
                            />
                          )}
                        </Flex>
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
