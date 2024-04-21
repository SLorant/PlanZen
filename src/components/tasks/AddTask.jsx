import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Tab,
  TabIndicator,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import DatePicker from "../calendar/DatePicker";
import ColorPicker from "../calendar/ColorPicker";
import axios from "axios";

const AddTask = ({ tasks, fetchTasks, task = null }) => {
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time.toString();
  };
  const getCurrentTime = (end = false, taskDate = null) => {
    let date = new Date();
    let hours;
    if (taskDate) {
      date = new Date(taskDate);
      hours = date.getHours();
    } else {
      hours = end ? date.getHours() + 1 : date.getHours();
    }
    const minutes = date.getMinutes();
    return `${formatTime(hours)}:${formatTime(minutes)}`;
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startTime, setStartTime] = useState(getCurrentTime());
  const [endTime, setEndTime] = useState(getCurrentTime(true));
  const initialRef = useRef(null);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    start: new Date(),
    end: new Date(),
    color: "",
  });
  const [isEvent, setIsEvent] = useState(false);
  const [isSimple, setIsSimple] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  //const [color, setColor] = useState(false);
  /*  const [startTime, setStartTime] = useState(`${() => new Date().getHours()}:00`);
  const [endTime, setEndTime] = useState(`${() => new Date().getHours()}:00`); */
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const toast = useToast();

  useEffect(() => {
    setIsRecurring(false);
    setIsSimple(true);
  }, [tasks]);

  useEffect(() => {
    if (task) {
      const tempTask = task;

      tempTask.start = task.start ? new Date(task.start) : new Date();
      tempTask.end = task.end ? new Date(task.end) : new Date();
      setNewTask(tempTask);
      if (task.start && task.end) {
        setStartTime(getCurrentTime(false, task.start));
        setEndTime(getCurrentTime(true, task.end));
      }

      if (task.isEvent) setIsEvent(true);
    }
  }, [task]);

  async function handleAddTask() {
    setNameError("");
    // Combine date and time for start and end dates
    const startDateTime = new Date(newTask.start);
    const endDateTime = new Date(newTask.start);

    if (isEvent) {
      const [startHours, startMinutes] = startTime.split(":");
      startDateTime.setHours(parseInt(startHours));
      startDateTime.setMinutes(parseInt(startMinutes));
      const [endHours, endMinutes] = endTime.split(":");
      endDateTime.setHours(parseInt(endHours));
      endDateTime.setMinutes(parseInt(endMinutes));
      endDateTime.setSeconds(0);
    }

    if (!newTask.name) {
      setNameError("Name required");
    }

    if (newTask.name.length > 30) {
      setNameError("Maximum 30 characters");
    }

    if (newTask.name && !(newTask.name.length > 30)) {
      try {
        if (!task) {
          await axios.post(
            "http://localhost:4000/addTask",
            {
              name: newTask.name,
              description: newTask.description,
              isRecurring: isRecurring,
              isEvent: isEvent,
              start: startDateTime,
              end: endDateTime,
              color: newTask.color,
            },
            {
              withCredentials: true,
            }
          );
        } else {
          await axios.post(
            "http://localhost:4000/updateTask",
            {
              id: newTask.id,
              name: newTask.name,
              description: newTask.description,
              isRecurring: isRecurring,
              isEvent: isEvent,
              start: startDateTime,
              end: endDateTime,
              color: newTask.color,
            },
            {
              withCredentials: true,
            }
          );
        }

        toast({
          title: `Task ${task ? "updated" : "added"}`,
          /* description: "You have successfully logged in.", */
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        /*  if (editing) {
          setAllEvents((prevEvents) => {
            const filtered = prevEvents.filter((item) => item.id !== newTask.id);
            return [...filtered, { ...newTask, start: startDateTime, end: endDateTime }];
          });
        } else {
          setnewTask({ ...newTask, start: startDateTime, end: endDateTime });
          fetchEvents();
        } */
        fetchTasks();
        onClose();
      } catch (error) {
        console.log(error?.response?.data);
        /*  setError(error?.response?.data); */
      }
    }
  }

  return (
    <>
      <Button onClick={onOpen} mt={6}>
        {task ? "Edit" : "Add"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> {task ? "Edit" : "Add"} task</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              onClose();
            }}
          />
          <ModalBody>
            <FormControl isInvalid={nameError}>
              <FormLabel>Title</FormLabel>
              <Input
                _focus={{ borderColor: "accent" }}
                ref={initialRef}
                type="text"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
              />
              <FormErrorMessage ml={1}>{nameError}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Task description goes here.."
                _focus={{ borderColor: "accent" }}
                type="textarea"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </FormControl>

            <Tabs width={"100%"} mt={4} variant="unstyled" isFitted>
              <TabList>
                <Tab
                  onClick={() => {
                    setIsSimple(true);
                    setIsRecurring(false);
                  }}
                >
                  Simple task
                </Tab>
                <Tab
                  onClick={() => {
                    setIsSimple(false);
                    setIsRecurring(true);
                    setIsEvent(false);
                  }}
                  isDisabled={task && task.isEvent}
                >
                  Daily task
                </Tab>
              </TabList>
              <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="accent"
                borderRadius="1px"
              />
              <TabPanels>
                <TabPanel
                  /* style={task && task.isEvent && { display: "none" }} */ paddingLeft={
                    1
                  }
                >
                  <FormControl
                    style={
                      task && task.isEvent
                        ? { display: "none" }
                        : { display: "flex" }
                    }
                    width={"50%"}
                    mt={0}
                    display="flex"
                    alignItems="center"
                    justifyContent={"space-between"}
                  >
                    <FormLabel marginLeft={0} htmlFor="isEvent" mb="0">
                      Add to calendar?
                    </FormLabel>
                    <Switch
                      isChecked={isEvent}
                      id="isEvent"
                      colorScheme={"primary"}
                      _focusVisible={{
                        border: "none",
                        boxShadow: "none",
                        outline: "none",
                      }}
                      onChange={() => {
                        setIsEvent(!isEvent);
                      }}
                    />
                  </FormControl>
                </TabPanel>
                <TabPanel
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"end"}
                  alignItems={"end"}
                >
                  <FormControl
                    width={"50%"}
                    mt={0}
                    display="flex"
                    alignItems="center"
                    justifyContent={"space-between"}
                  >
                    <FormLabel marginLeft={0} htmlFor="isEvent" mb="0">
                      Make it a habit?
                    </FormLabel>
                    <Switch
                      isChecked={isEvent}
                      id="isEvent"
                      colorScheme={"primary"}
                      _focusVisible={{
                        border: "none",
                        boxShadow: "none",
                        outline: "none",
                      }}
                      /* onChange={() => {
                        setIsEvent(!isEvent);
                      }} */
                    />
                  </FormControl>
                </TabPanel>
              </TabPanels>
            </Tabs>

            {isEvent && isSimple && (
              <>
                <FormControl mt={4}>
                  <FormLabel>Date</FormLabel>
                  <DatePicker
                    newEvent={newTask}
                    setNewEvent={setNewTask}
                    start={true}
                  />
                  <FormErrorMessage ml={1}></FormErrorMessage>
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Start time</FormLabel>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    _focus={{ borderColor: "accent" }}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>End time</FormLabel>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    _focus={{ borderColor: "accent" }}
                  />
                </FormControl>

                <FormControl
                  mt={4}
                  display="flex"
                  alignItems="center"
                  justifyContent={"space-between"}
                >
                  <FormLabel mb="0">Event color</FormLabel>
                  <ColorPicker newEvent={newTask} setNewEvent={setNewTask} />
                </FormControl>
              </>
            )}
            {error && (
              <Text mt={2} ml={1} color={"red"}>
                {error}
              </Text>
            )}
            <ModalFooter mt={4} paddingInlineEnd={"0"}>
              <Button
                color={"text"}
                mr={3}
                onClick={() => {
                  onClose();
                  setIsEvent(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color={"text"}
                _hover={{ bg: "secondary" }}
                _focus={{ bg: "secondary" }}
                colorScheme={"primary"}
                onClick={handleAddTask}
              >
                {task ? "Update" : "Add"} task
              </Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddTask;