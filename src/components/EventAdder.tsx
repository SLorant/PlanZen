import { useState, useRef, useEffect } from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
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
} from "@chakra-ui/react";
import ColorPicker from "./ColorPicker";
import axios from "axios";
import Login from "../pages/Login";
import LoginCheckUtil from "./LoginCheckUtil";

const EventAdder = ({ allEvents, setAllEvents }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), color: "#43e56e" });
  const [multiday, setMultiday] = useState(false);
  //const [color, setColor] = useState(false);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (newEvent.title) setNameError("");
    else setNameError("Title required");
  }, [newEvent]);

  async function handleAddEvent() {
    // Combine date and time for start and end dates
    const startDateTime = new Date(newEvent.start);
    const [startHours, startMinutes] = startTime.split(":");
    startDateTime.setHours(parseInt(startHours));
    startDateTime.setMinutes(parseInt(startMinutes));

    const endDateTime = new Date(multiday ? newEvent.end : newEvent.start);
    const [endHours, endMinutes] = endTime.split(":");
    endDateTime.setHours(parseInt(multiday ? startHours : endHours));
    endDateTime.setMinutes(parseInt(multiday ? startMinutes : endMinutes));

    if (!nameError) {
      console.log("Asd");
      try {
        await axios.post(
          "http://localhost:4000/addEvent",
          { title: newEvent.title, start: startDateTime, end: endDateTime, color: newEvent.color },
          {
            withCredentials: true,
          }
        );

        toast({
          title: "Event added",
          /* description: "You have successfully logged in.", */
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        console.log(newEvent.color);
        setNewEvent({ ...newEvent, start: startDateTime, end: endDateTime });
        setAllEvents([...allEvents, { ...newEvent, start: startDateTime, end: endDateTime }]);
        onClose();
      } catch (error) {
        setError(error?.response?.data);
      }
    }
  }

  const propConfig = {
    dateNavBtnProps: {
      backgroundColor: "primary",
      variant: "outline",
    },
    dayOfMonthBtnProps: {
      defaultBtnProps: {
        borderColor: "red.300",
        _hover: {
          background: "blue.400",
        },
      },
    },
  };

  const handleLoginCheck = async () => {
    const result = await LoginCheckUtil(toast);
    console.log(result);
    if (result) onOpen();
  };

  return (
    <>
      <Button onClick={handleLoginCheck}>Open Modal</Button>
      <Modal
        backgroundColor={"secondary"}
        closeOnOverlayClick={false}
        initialFocusRef={initialRef}
        size={"sm"}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add event</ModalHeader>
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
                focusBorderColor="accent"
                ref={initialRef}
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <FormErrorMessage ml={1}>{nameError}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{multiday ? "Start" : "Event"} date</FormLabel>
              <SingleDatepicker
                name="date-input"
                date={newEvent.start}
                propsConfigs={propConfig}
                onDateChange={(start) => setNewEvent({ ...newEvent, start })}
              />
              <FormErrorMessage ml={1}></FormErrorMessage>
            </FormControl>

            <FormControl mt={4} display="flex" alignItems="center">
              <FormLabel htmlFor="multiday" mb="0">
                Multi-day event?
              </FormLabel>
              <Switch
                id="multiday"
                onChange={() => {
                  setMultiday(!multiday);
                }}
              />
            </FormControl>

            {multiday ? (
              <FormControl mt={4}>
                <FormLabel>End date</FormLabel>
                <SingleDatepicker
                  name="date-input"
                  date={newEvent.end}
                  propsConfigs={propConfig}
                  onDateChange={(end) => setNewEvent({ ...newEvent, end })}
                />
                <FormErrorMessage ml={1}></FormErrorMessage>
              </FormControl>
            ) : (
              <>
                <FormControl mt={4}>
                  <FormLabel>Start time</FormLabel>
                  <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>End time</FormLabel>
                  <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </FormControl>
              </>
            )}
            <FormControl ml={2} mt={4} display="flex" alignItems="center">
              <FormLabel mb="0">Change event color</FormLabel>
              <ColorPicker setNewEvent={setNewEvent} />
            </FormControl>
            {error && (
              <Text mt={2} ml={1} color={"red"}>
                {error}
              </Text>
            )}
            <ModalFooter mt={2}>
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
                backgroundColor={"primary"}
                onClick={handleAddEvent}
              >
                Add event
              </Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Login />
    </>
  );
};

export default EventAdder;
