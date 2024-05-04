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
  Text,
  Flex,
} from "@chakra-ui/react";
import ColorPicker from "./ColorPicker";
import axios from "axios";
import DatePicker from "./DatePicker";
import { isSameDay } from "../../utils/TimeUtils";
import EventTabs from "./EventTabs";
import PlusIcon from "../../assets/icons/PlusIcon";
import { usePocket } from "../../contexts/PocketContext";

const initialErrors = {
  api: "",
  name: "",
  start: "",
  end: "",
  until: "",
};

const AddEvent = ({ allEvents, slotEvent, editing, fetchAllEvents }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    until: new Date(),
    color: "#43e56e",
  });
  const [multiday, setMultiday] = useState(false);
  const [isSimple, setIsSimple] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);
  const [errors, setErrors] = useState(initialErrors);
  const toast = useToast();
  const { user } = usePocket();

  //Refresh form event when calendar refreshes
  useEffect(() => {
    setNewEvent({
      title: "",
      start: new Date(),
      end: new Date(),
      until: new Date(),
      color: "#43e56e",
    });
  }, [allEvents]);

  //Time formatting shenaningans
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

  //Check if form data is valid
  const IsValid = (newEvent, multiday, startTime, endTime) => {
    const updatedErrors = { ...initialErrors };
    let valid = true;

    if (!newEvent.title) {
      updatedErrors.name = "Title required";
      valid = false;
    }
    if (!multiday && !startTime) {
      updatedErrors.start = "Start time required";
      valid = false;
    }
    if (!multiday && !endTime) {
      updatedErrors.end = "End time required";
      valid = false;
    }
    if (newEvent.until) {
      const startDate = newEvent.start;
      const endDate = newEvent.until;

      const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
      const monthsDiff = endDate.getMonth() - startDate.getMonth();

      const totalMonthsDiff = yearsDiff * 12 + monthsDiff;
      if (totalMonthsDiff > 12) {
        updatedErrors.until = "Time distance too big";
        valid = false;
      }
      if (startDate > endDate) {
        updatedErrors.until = "Start date can't be later than end date";
        valid = false;
      }
    }

    setErrors(updatedErrors);
    return valid;
  };

  //Clicking on existing event, or spare slot executes this
  const handleSlotClick = async () => {
    if (slotEvent && user) {
      //Date formatting
      const start = new Date(slotEvent.start);
      const end = new Date(slotEvent.end);
      setStartTime(`${formatTime(start.getHours())}:${formatTime(start.getMinutes())}`);
      setEndTime(`${formatTime(end.getHours())}:${formatTime(end.getMinutes())}`);

      //Open modal
      onOpen();

      if (editing) {
        setNewEvent({
          id: slotEvent.id,
          title: slotEvent.title,
          start: slotEvent.start,
          end: slotEvent.end,
          until: slotEvent.until ? new Date(slotEvent.until) : slotEvent.start,
          color: slotEvent.color,
        });
        if (slotEvent.until) setIsRecurring(true);
      } else {
        setNewEvent({ title: "", start: slotEvent.start, end: slotEvent.end });
      }
      if (slotEvent.multiday || !isSameDay(start, end)) setMultiday(true);
    }
  };

  useEffect(() => {
    if (!editing && !slotEvent.new) {
      handleSlotClick();
    }
  }, [slotEvent]);

  async function handleAddEvent() {
    // Combine date and time for start and end dates
    const startDateTime = new Date(newEvent.start);
    const [startHours, startMinutes] = startTime.split(":");
    startDateTime.setHours(parseInt(startHours));
    startDateTime.setMinutes(parseInt(startMinutes));

    let endDateTime = new Date(isSimple ? newEvent.start : newEvent.end);
    if (isRecurring) endDateTime = newEvent.until;
    const [endHours, endMinutes] = endTime.split(":");
    endDateTime.setHours(parseInt(multiday ? startHours : endHours));
    endDateTime.setMinutes(parseInt(multiday ? startMinutes : endMinutes));
    endDateTime.setSeconds(0);

    if (IsValid(newEvent, multiday, startTime, endTime)) {
      try {
        if (editing) {
          await axios.post(
            `${import.meta.env.VITE_LOCAL_SERVER}/updateEvent`,
            {
              id: newEvent.id,
              title: newEvent.title,
              start: startDateTime,
              end: endDateTime,
              color: newEvent.color,
              isRecurring: isRecurring,
              until: newEvent.until,
              userID: user.id,
            },
            {
              withCredentials: false,
            }
          );
        } else {
          await axios.post(
            `${import.meta.env.VITE_LOCAL_SERVER}/addEvent`,
            {
              title: newEvent.title,
              start: startDateTime,
              end: endDateTime,
              color: newEvent.color,
              isRecurring: isRecurring,
              userID: user.id,
            },
            {
              withCredentials: false,
            }
          );
        }

        toast({
          title: `Event ${editing ? "updated" : "added"}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        //Close and refresh
        onClose();
        fetchAllEvents();
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          api: error?.response?.data,
        }));
      }
    }
  }

  const handleAddButton = async () => {
    if (editing && user) handleSlotClick();
    else if (user) onOpen();
    else {
      toast({
        title: "Please log in",
        description: "You have to log in first to add an event",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex>
      {editing ? (
        <Button color={"darktext"} fontSize={"md"} colorScheme="primary" onClick={handleAddButton}>
          Edit
        </Button>
      ) : (
        <Button
          zIndex={50}
          position={["fixed", "absolute"]}
          top={["auto", 6]}
          bottom={[10, "auto"]}
          right={[10, "34px"]}
          textColor={"darktext"}
          colorScheme={"primary"}
          borderRadius={[20, 8]}
          onClick={handleAddButton}
          height={[16, 10]}
          width={[16, "auto"]}
          padding={[3]}
          _hover={{ backgroundColor: "secondary.500" }}
        >
          <PlusIcon />
        </Button>
      )}
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
            <FormControl isInvalid={errors.name}>
              <FormLabel>Event title</FormLabel>
              <Input
                _focus={{ borderColor: "accent" }}
                ref={initialRef}
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <FormErrorMessage ml={1}>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{isSimple ? "Event" : "Start"} date</FormLabel>
              <DatePicker newEvent={newEvent} setNewEvent={setNewEvent} start={true} />
              <FormErrorMessage ml={1}></FormErrorMessage>
            </FormControl>

            <EventTabs
              {...{
                multiday,
                setMultiday,
                isRecurring,
                setIsSimple,
                setIsRecurring,
                errors,
                startTime,
                endTime,
                newEvent,
                setNewEvent,
                setStartTime,
                setEndTime,
              }}
            />

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
            {errors.api && (
              <Text mt={2} ml={1} color={"red"}>
                {errors.api}
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
