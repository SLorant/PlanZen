import {
  Box,
  Button,
  Card,
  CardBody,
  Collapse,
  Flex,
  Heading,
  Text,
  ScaleFade,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import SideMenu from "../components/SideMenu";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import AddTask from "../components/tasks/AddTask";
import LoginCheckUtil from "../utils/LoginCheckUtil";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import DeleteTask from "../components/tasks/DeleteTask";
import ArrowIcon from "../assets/icons/ArrowIcon";
import { AuthContext } from "../utils/AuthContext";

const Tasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [collapseStates, setCollapseStates] = useState([]);
  const [fadeStates, setFadeStates] = useState({});
  const { loggedIn } = useContext(AuthContext);
  const taskbg = useColorModeValue("#eee", "gray.900");

  useEffect(() => {
    try {
      if (loggedIn) fetchAllTasks();
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

        for (const task of tasks) {
          //If task is an event too, get the corresponding event from db
          if (task.isEvent && task.id) {
            const event = await axios.post(
              "http://localhost:4000/getEventByTask",
              { taskID: task.id },
              {
                withCredentials: true,
              }
            );
            //Set task properties based on the event
            task.start = event?.data?.start;
            task.end = event?.data?.end;
            task.color = event?.data?.color;

            //Check if today, yesterday, or tomorrow
            const startDate = moment(event?.data?.start);
            const endDate = moment(event?.data?.end);
            const tomorrow = moment().add(1, "days");
            const yesterday = moment().subtract(1, "days");
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
            //Date formatting
            task.startTime = startDate.format("HH:mm");
            task.endTime = endDate.format("HH:mm");
          }
        }
        // Tasks that are done have to displayed last
        const sortedTasks = tasks.sort((a, b) => {
          // Sorting
          if (a.isDone === false && b.isDone === true) {
            return -1;
          } else if (a.isDone === true && b.isDone === false) {
            return 1;
          } else {
            return 0; // Leave order unchanged
          }
        });
        // Partition tasks into two groups: done and not done
        // Then order them based on the edit date, the newest can be seen first
        const doneTasks = sortedTasks
          .filter((task) => task.isDone)
          .sort((a, b) => new Date(b.updated) - new Date(a.updated));
        const notDoneTasks = sortedTasks
          .filter((task) => !task.isDone)
          .sort((a, b) => new Date(b.updated) - new Date(a.updated));

        // Concatenate sorted groups
        const finalSortedTasks = notDoneTasks.concat(doneTasks);

        setAllTasks(finalSortedTasks);
        //Animation
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
  };

  return (
    <Wrapper>
      <SideMenu />
      <Heading mb={12} textAlign={"center"} mt={[6, 0]}>
        Tasks
      </Heading>
      <AddTask tasks={allTasks} fetchTasks={fetchAllTasks} />
      {loggedIn === false && <Text>Log in to see your tasks!</Text>}
      <Flex
        flexDirection={"column"}
        gap={6}
        padding={[6, 0]}
        paddingTop={0}
        maxHeight={["auto", "40vh"]}
        overflow={"scroll"}
      >
        {allTasks &&
          allTasks.map((task, index) => (
            <ScaleFade initialScale={0.9} in={fadeStates[task.id]} key={index}>
              <Card marginRight={[0, 2]} backgroundColor={task.isDone ? taskbg : "cardbg"}>
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
                    <Flex justifyContent={"space-between"} alignItems={"center"}>
                      <Button
                        variant={"unstyled"}
                        fontWeight={"normal"}
                        textDecorationLine={`${task.isDone ? "line-through" : ""}`}
                        fontSize={task.name.length < 10 ? "xl" : task.name.length < 25 ? "lg" : "md"}
                        onClick={() => toggleCollapse(index)}
                      >
                        <Text textAlign={"left"} whiteSpace={"collapse"} /* style={{ whiteSpace: "wrap" }} */>
                          {task.name}
                        </Text>
                      </Button>

                      {!task.isDone && (
                        <Flex justifyContent={"end"} alignItems={"center"} gap={3}>
                          <Button
                            colorScheme="secondary"
                            size={"sm"}
                            onClick={() => toggleCollapse(index)}
                            padding={"7px"}
                          >
                            <ArrowIcon />
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
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M5 12l5 5l10 -10" />
                            </svg>
                          </Button>
                        </Flex>
                      )}
                    </Flex>
                    <Collapse
                      in={collapseStates[index]}
                      transition={{
                        /* exit: { delay: 1 }, */ enter: { duration: 0.3 },
                      }}
                    >
                      <Box p="20px" color="text" mt="4" backgroundColor={"bg"} rounded="md" shadow="md">
                        {task.start && task.end && task.day && (
                          <Text opacity={0.7} color={"text"} mb={2} fontSize={["sm", "md"]}>
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
                        <AddTask tasks={allTasks} fetchTasks={fetchAllTasks} task={task} />
                      </Flex>
                    </Collapse>
                  </Box>
                </CardBody>
              </Card>
            </ScaleFade>
          ))}
      </Flex>
    </Wrapper>
  );
};

export default Tasks;
