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
} from "@chakra-ui/react";
import ColorPicker from "./ColorPicker";
import axios from "axios";
import LoginCheckUtil from "../../utils/LoginCheckUtil";
import DatePicker from "./DatePicker";

const AddEvent = ({ /*  allEvents */ setAllEvents, slotEvent, editing, fetchEvents }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: new Date(), color: "#43e56e" });
  const [multiday, setMultiday] = useState(false);
  //const [color, setColor] = useState(false);
  /*  const [startTime, setStartTime] = useState(`${() => new Date().getHours()}:00`);
  const [endTime, setEndTime] = useState(`${() => new Date().getHours()}:00`); */
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const toast = useToast();

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

    if (slotEvent && result && slotEvent.start) {
      const start = new Date(slotEvent.start);
      const end = new Date(slotEvent.end);

      const isSameDay =
        start.getFullYear() === end.getFullYear() &&
        start.getMonth() === end.getMonth() &&
        start.getDay() === end.getDay();

      const startTimeFormatted = `${formatTime(start.getHours())}:${formatTime(start.getMinutes())}`;
      const endTimeFormatted = `${formatTime(end.getHours())}:${formatTime(end.getMinutes())}`;

      setStartTime(startTimeFormatted);
      setEndTime(endTimeFormatted);
      onOpen();
      if (editing) {
        setNewEvent({
          id: slotEvent.id,
          title: slotEvent.title,
          start: slotEvent.start,
          end: slotEvent.end,
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

    const endDateTime = new Date(multiday ? newEvent.end : newEvent.start);
    const [endHours, endMinutes] = endTime.split(":");
    endDateTime.setHours(parseInt(multiday ? startHours : endHours));
    endDateTime.setMinutes(parseInt(multiday ? startMinutes : endMinutes));
    endDateTime.setSeconds(0);
    if (!newEvent.title) {
      setNameError("Title required");
    }
    console.log(editing);
    if (newEvent.title) {
      try {
        if (editing) {
          console.log(newEvent.id);
          await axios.post(
            "http://localhost:4000/updateEvent",
            { id: newEvent.id, title: newEvent.title, start: startDateTime, end: endDateTime, color: newEvent.color },
            {
              withCredentials: true,
            }
          );
        } else {
          console.log(newEvent);

          await axios.post(
            "http://localhost:4000/addEvent",
            { title: newEvent.title, start: startDateTime, end: endDateTime, color: newEvent.color },
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
          setAllEvents((prevEvents) => {
            const filtered = prevEvents.filter((item) => item.id !== newEvent.id);
            return [...filtered, { ...newEvent, start: startDateTime, end: endDateTime }];
          });
        } else {
          setNewEvent({ ...newEvent, start: startDateTime, end: endDateTime });
          fetchEvents();
        }

        onClose();
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
    <>
      <Button colorScheme="primary" color={"text"} onClick={handleAddButton}>
        {editing ? "Edit" : "Add"} event
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
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <FormErrorMessage ml={1}>{nameError}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{multiday ? "Start" : "Event"} date</FormLabel>
              <DatePicker newEvent={newEvent} setNewEvent={setNewEvent} start={true} />
              <FormErrorMessage ml={1}></FormErrorMessage>
            </FormControl>

            <FormControl mt={4} display="flex" alignItems="center" justifyContent={"space-between"}>
              <FormLabel htmlFor="multiday" mb="0">
                Multi-day event?
              </FormLabel>
              <Switch
                isChecked={multiday}
                id="multiday"
                colorScheme={"primary"}
                _focusVisible={{ border: "none", boxShadow: "none", outline: "none" }}
                onChange={() => {
                  setMultiday(!multiday);
                }}
              />
            </FormControl>

            {multiday ? (
              <FormControl mt={4}>
                <FormLabel>End date</FormLabel>
                <DatePicker newEvent={newEvent} setNewEvent={setNewEvent} start={false} />
                <FormErrorMessage ml={1}></FormErrorMessage>
              </FormControl>
            ) : (
              <>
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
              </>
            )}
            <FormControl mt={4} display="flex" alignItems="center" justifyContent={"space-between"}>
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
    </>
  );
};

export default AddEvent;
