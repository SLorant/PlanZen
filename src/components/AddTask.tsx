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
import React, { useRef, useState } from "react";
import DatePicker from "./calendar/DatePicker";
import ColorPicker from "./calendar/ColorPicker";
import axios from "axios";

const AddTask = ({ fetchTasks }) => {
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time.toString();
  };
  const getCurrentTime = (end = false) => {
    const date = new Date();
    const hours = end ? date.getHours() + 1 : date.getHours();
    const minutes = date.getMinutes();

    return `${formatTime(hours)}:${formatTime(minutes)}`;
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [startTime, setStartTime] = useState(getCurrentTime());
  const [endTime, setEndTime] = useState(getCurrentTime(true));
  const initialRef = useRef(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", start: new Date(), end: new Date(), color: "" });
  const [isEvent, setIsEvent] = useState(false);
  const [isSimple, setIsSimple] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  //const [color, setColor] = useState(false);
  /*  const [startTime, setStartTime] = useState(`${() => new Date().getHours()}:00`);
  const [endTime, setEndTime] = useState(`${() => new Date().getHours()}:00`); */
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const toast = useToast();

  async function handleAddTask() {
    // Combine date and time for start and end dates
    const startDateTime = new Date(newTask.start);
    const endDateTime = new Date(newTask.start);

    if (isEvent) {
      const [startHours, startMinutes] = startTime.split(":");
      startDateTime.setHours(parseInt(startHours));
      startDateTime.setMinutes(parseInt(startMinutes));
      console.log(startDateTime);
      const [endHours, endMinutes] = endTime.split(":");
      endDateTime.setHours(parseInt(endHours));
      endDateTime.setMinutes(parseInt(endMinutes));
      endDateTime.setSeconds(0);
    }

    if (!newTask.title) {
      setNameError("Title required");
    }
    if (newTask.title) {
      console.log(isEvent);
      try {
        await axios.post(
          "http://localhost:4000/addTask",
          {
            name: newTask.title,
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

        toast({
          title: `Task added`,
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
        console.log(error);
        console.log(error?.response?.data);
        setError(error?.response?.data);
      }
    }
  }

  return (
    <>
      <Button onClick={onOpen} mt={6}>
        Add task
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Add task</ModalHeader>
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
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
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
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
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
                >
                  Recurring task
                </Tab>
              </TabList>
              <TabIndicator mt="-1.5px" height="2px" bg="accent" borderRadius="1px" />
              <TabPanels>
                <TabPanel paddingLeft={1}>
                  <FormControl width={"50%"} mt={0} display="flex" alignItems="center" justifyContent={"space-between"}>
                    <FormLabel marginLeft={0} htmlFor="isEvent" mb="0">
                      Make it an event?
                    </FormLabel>
                    <Switch
                      isChecked={isEvent}
                      id="isEvent"
                      colorScheme={"primary"}
                      _focusVisible={{ border: "none", boxShadow: "none", outline: "none" }}
                      onChange={() => {
                        setIsEvent(!isEvent);
                      }}
                    />
                  </FormControl>
                </TabPanel>
                <TabPanel display={"flex"} flexDirection={"column"} justifyContent={"end"} alignItems={"end"}>
                  <FormControl width={"50%"} mt={0} display="flex" alignItems="center" justifyContent={"space-between"}>
                    <FormLabel marginLeft={0} htmlFor="isEvent" mb="0">
                      Make it a habit?
                    </FormLabel>
                    <Switch
                      isChecked={isEvent}
                      id="isEvent"
                      colorScheme={"primary"}
                      _focusVisible={{ border: "none", boxShadow: "none", outline: "none" }}
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
                  <DatePicker newEvent={newTask} setNewEvent={setNewTask} start={true} />
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

                <FormControl mt={4} display="flex" alignItems="center" justifyContent={"space-between"}>
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
                Add task
              </Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddTask;
