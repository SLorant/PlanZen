import { useState, useRef, useEffect } from "react";
import {
  Button,
  Modal,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  FormErrorMessage,
  useToast,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  ModalFooter,
  Switch,
  Text,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  TabPanels,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import ColorPicker from "./ColorPicker";
import axios from "axios";
import LoginCheckUtil from "../../utils/LoginCheckUtil";
import DatePicker from "./DatePicker";

const AddEvent = ({
  allEvents,
  setAllEvents,
  slotEvent,
  editing,
  fetchAllEvents,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    color: "#43e56e",
  });
  const [multiday, setMultiday] = useState(false);
  const [isSimple, setIsSimple] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  //const [color, setColor] = useState(false);
  /*  const [startTime, setStartTime] = useState(`${() => new Date().getHours()}:00`);
  const [endTime, setEndTime] = useState(`${() => new Date().getHours()}:00`); */
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [startError, setStartError] = useState("");
  const [endError, setEndError] = useState("");
  const [untilError, setUntilError] = useState("");
  const toast = useToast();

  useEffect(() => {
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(),
      color: "#43e56e",
    });
  }, [allEvents]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time.toString();
  };

  const getCurrentTime = (end = false) => {
    const date = new Date();
    const hours = end ? date.getHours() + 1 : date.getHours();
    const minutes = date.getMinutes();

    return `${formatTime(hours)}:${formatTime(minutes)}`;
  };

  const [startTime, setStartTime] = useState(getCurrentTime());
  const [endTime, setEndTime] = useState(getCurrentTime(true));

  const handleSlotEvent = async () => {
    const result = await LoginCheckUtil();

    if (
      slotEvent &&
      result &&
      slotEvent.start /*  && slotEvent.slotClicked */
    ) {
      console.log(slotEvent);
      const start = new Date(slotEvent.start);
      const end = new Date(slotEvent.end);
      const isSameDay =
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth() &&
        start.getDay() === end.getDay();

      const startTimeFormatted = `${formatTime(start.getHours())}:${formatTime(
        start.getMinutes()
      )}`;
      /* let endTimeFormatted;
      if (isRecurring)
        endTimeFormatted = `${formatTime(new Date(slotEvent.until).getHours())}:${formatTime(
          new Date(slotEvent.until).getMinutes()
        )}`;
      else  */ const endTimeFormatted = `${formatTime(
        end.getHours()
      )}:${formatTime(end.getMinutes())}`;

      setStartTime(startTimeFormatted);
      setEndTime(endTimeFormatted);
      onOpen();
      console.log(slotEvent);
      if (editing) {
        setNewEvent({
          id: slotEvent.id,
          title: slotEvent.title,
          start: slotEvent.start,
          end: slotEvent.end,
          until: slotEvent.until ? new Date(slotEvent.until) : slotEvent.start,
          color: slotEvent.color,
        });
      } else {
        setNewEvent({ title: "", start: slotEvent.start, end: slotEvent.end });
      }

      if (slotEvent.multiday || !isSameDay) setMultiday(true);
    }
  };

  useEffect(() => {
    if (newEvent.title) setNameError("");
  }, [newEvent]);

  useEffect(() => {
    if (!editing) {
      handleSlotEvent();
    }
  }, [slotEvent]);

  async function handleAddEvent() {
    // Combine date and time for start and end dates
    const startDateTime = new Date(newEvent.start);
    const [startHours, startMinutes] = startTime.split(":");
    startDateTime.setHours(parseInt(startHours));
    startDateTime.setMinutes(parseInt(startMinutes));

    const endDateTime = new Date(isSimple ? newEvent.start : newEvent.end);
    const [endHours, endMinutes] = endTime.split(":");
    endDateTime.setHours(parseInt(multiday ? startHours : endHours));
    endDateTime.setMinutes(parseInt(multiday ? startMinutes : endMinutes));
    endDateTime.setSeconds(0);
    let hasErrors = false;
    if (!newEvent.title) {
      setNameError("Title required");
      hasErrors = true;
    }
    if (!multiday && !startTime) {
      setStartError("Start time required");
      hasErrors = true;
    }
    if (!multiday && !endTime) {
      setEndError("End time required");
      hasErrors = true;
    }
    if (newEvent.until) {
      const startDate = newEvent.start;
      const endDate = newEvent.until;

      const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
      const monthsDiff = endDate.getMonth() - startDate.getMonth();

      const totalMonthsDiff = yearsDiff * 12 + monthsDiff;
      if (totalMonthsDiff > 12) {
        setUntilError("Time distance too big");
        hasErrors = true;
      }
    }

    console.log(editing);
    if (!hasErrors) {
      /*    if (editing && isRecurring) {
        newEvent.until = 
 
        console.log(rule.all());
      } */
      try {
        if (editing) {
          console.log(isRecurring);
          await axios.post(
            "http://localhost:4000/updateEvent",
            {
              id: newEvent.id,
              title: newEvent.title,
              start: startDateTime,
              end: endDateTime,
              color: newEvent.color,
              isRecurring: isRecurring,
              until: newEvent.until,
            },
            {
              withCredentials: true,
            }
          );
        } else {
          await axios.post(
            "http://localhost:4000/addEvent",
            {
              title: newEvent.title,
              start: startDateTime,
              end: endDateTime,
              color: newEvent.color,
              isRecurring: isRecurring,
            },
            {
              withCredentials: true,
            }
          );
        }

        toast({
          title: `Event ${editing ? "updated" : "added"}`,
          /* description: "You have successfully logged in.", */
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        console.log(newEvent.color);
        if (editing) {
          /*  setAllEvents((prevEvents) => {
            console.log(prevEvents.filter((item) => item.id !== newEvent.id));
            const filtered = prevEvents.filter((item) => item.id !== newEvent.id);
            return [...filtered, { ...newEvent, start: startDateTime, end: endDateTime }];
          }); */
        } else {
          setNewEvent({ ...newEvent, start: startDateTime, end: endDateTime });
          //fetchEvents();
        }

        onClose();
        fetchAllEvents();
      } catch (error) {
        console.log(error);
        setError(error?.response?.data);
      }
    }
  }

  const handleAddButton = async () => {
    const result = await LoginCheckUtil(toast);
    if (editing) handleSlotEvent();
    if (result) onOpen();
  };

  return (
    <Flex mt={6} justifyContent={"end"} width={"100%"}>
      <Button
        fontSize={"3xl"}
        colorScheme="primary"
        color={"text"}
        /*   paddingTop={4} */
        onClick={handleAddButton}
        borderRadius={50}
      >
        {editing ? "Edit" : "+"}
      </Button>
      <Modal
        colorScheme={"secondary"}
        closeOnOverlayClick={false}
        initialFocusRef={initialRef}
        size={"sm"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editing ? "Edit" : "Add"} event</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              onClose();
              setMultiday(false);
            }}
          />
          <ModalBody>
            <FormControl isInvalid={nameError}>
              <FormLabel>Event title</FormLabel>
              <Input
                _focus={{ borderColor: "accent" }}
                ref={initialRef}
                type="text"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
              <FormErrorMessage ml={1}>{nameError}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{isSimple ? "Event" : "Start"} date</FormLabel>
              <DatePicker
                newEvent={newEvent}
                setNewEvent={setNewEvent}
                start={true}
              />
              <FormErrorMessage ml={1}></FormErrorMessage>
            </FormControl>

            <Tabs
              /* defaultIndex={isSimple ? 0 : isRecurring ? 2 : 1}  */ width={
                "100%"
              }
              mt={4}
              variant="unstyled"
              isFitted
            >
              <TabList>
                <Tab
                  onClick={() => {
                    setIsSimple(true);
                    setMultiday(false);
                    setIsRecurring(false);
                  }}
                >
                  One-time
                </Tab>
                <Tab
                  onClick={() => {
                    setMultiday(true);
                    setIsRecurring(false);
                    setIsSimple(false);
                  }}
                >
                  Multi-day
                </Tab>
                <Tab
                  onClick={() => {
                    setIsRecurring(true);
                    setIsSimple(false);
                    setMultiday(false);
                  }}
                >
                  Recurring
                </Tab>
              </TabList>
              <TabIndicator
                mt="-1.5px"
                height="2px"
                bg="accent"
                borderRadius="1px"
              />
              <TabPanels>
                <TabPanel paddingLeft={1}>
                  <FormControl mt={2} isInvalid={startError}>
                    <FormLabel>Start time</FormLabel>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      _focus={{ borderColor: "accent" }}
                    />
                    <FormErrorMessage ml={1}>{startError}</FormErrorMessage>
                  </FormControl>
                  <FormControl mt={4} isInvalid={endError}>
                    <FormLabel>End time</FormLabel>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      _focus={{ borderColor: "accent" }}
                    />
                    <FormErrorMessage ml={1}>{endError}</FormErrorMessage>
                  </FormControl>
                </TabPanel>
                <TabPanel paddingLeft={1}>
                  <FormControl mt={2}>
                    <FormLabel>End date</FormLabel>
                    <DatePicker
                      newEvent={newEvent}
                      setNewEvent={setNewEvent}
                      start={false}
                    />
                    <FormErrorMessage ml={1}></FormErrorMessage>
                  </FormControl>
                </TabPanel>
                <TabPanel paddingLeft={1} paddingTop={1}>
                  <Text
                    fontStyle={"italic"}
                    textAlign={"right"}
                    fontSize={"sm"}
                  >
                    Recurs weekly
                  </Text>
                  <FormControl mt={0} isInvalid={startError}>
                    <FormLabel>Start time</FormLabel>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      _focus={{ borderColor: "accent" }}
                    />
                    <FormErrorMessage ml={1}>{startError}</FormErrorMessage>
                  </FormControl>
                  <FormControl mt={4} isInvalid={endError}>
                    <FormLabel>End time</FormLabel>
                    <Input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      _focus={{ borderColor: "accent" }}
                    />
                    <FormErrorMessage ml={1}>{endError}</FormErrorMessage>
                  </FormControl>
                  <FormControl mt={4} isInvalid={untilError}>
                    <FormLabel>Until</FormLabel>
                    <DatePicker
                      newEvent={newEvent}
                      setNewEvent={setNewEvent}
                      start={false}
                      recurring={isRecurring}
                    />
                    <FormErrorMessage ml={1}>{untilError}</FormErrorMessage>
                  </FormControl>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <FormControl
              paddingLeft={1}
              paddingRight={4}
              mt={2}
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <FormLabel mb="0">Change event color</FormLabel>
              <ColorPicker newEvent={newEvent} setNewEvent={setNewEvent} />
            </FormControl>
            {error && (
              <Text mt={2} ml={1} color={"red"}>
                {error}
              </Text>
            )}
            <ModalFooter mt={8} paddingInlineEnd={"0"}>
              <Button
                color={"text"}
                mr={3}
                onClick={() => {
                  onClose();
                  setMultiday(false);
                }}
              >
                Cancel
              </Button>
              <Button
                color={"text"}
                _hover={{ bg: "secondary" }}
                _focus={{ bg: "secondary" }}
                colorScheme={"primary"}
                onClick={handleAddEvent}
              >
                Add event
              </Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default AddEvent;
