import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  useDisclosure,
  Button,
  Box,
  Text,
  useToast,
} from "@chakra-ui/react";
import AddEvent from "./AddEvent";
import LoginCheckUtil from "./LoginCheckUtil";
import axios from "axios";
import { useEffect } from "react";

const EditEvent = ({ editedEvent, isOpen, onOpen, onClose, allEvents, setAllEvents, fetchEvents }) => {
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();

  /*   useEffect(() => {
    onClose();
  }, [allEvents, onClose]); */

  const deleteEvent = async () => {
    const result = await LoginCheckUtil();
    if (result && editedEvent.id) {
      try {
        const result = await axios.delete(
          "http://localhost:4000/deleteEvent",
          {
            data: { id: editedEvent.id },
          },
          {
            withCredentials: true,
          }
        );
        if (result) {
          onDeleteClose();
          onClose();
          toast({
            title: `Event deleted succesfully`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          fetchEvents();
        }
      } catch (e) {
        console.log(e?.response?.data);
      }
    }
  };

  return (
    <>
      <Modal size={"sm"} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Event panel</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              onClose();
            }}
          />
          <ModalBody display={"flex"} flexDirection={"column"} alignItems={"center"} gap={8}>
            <Text fontSize={18}>Event title: {editedEvent.title}</Text>
            <Box display={"flex"} justifyContent={"space-around"} width={"100%"}>
              <AddEvent allEvents={allEvents} setAllEvents={setAllEvents} slotEvent={editedEvent} editing={true} />

              <Button
                backgroundColor="red.300"
                onClick={onDeleteOpen}
                _hover={{
                  background: "red.200",
                }}
              >
                Delete event
              </Button>
            </Box>
            <Button colorScheme="secondary" color={"text"} width={"200px"} mb={6}>
              See related task
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal size={"md"} isOpen={isDeleteOpen} onOpen={onDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete event</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              onDeleteClose();
            }}
          />
          <ModalBody display={"flex"} flexDirection={"column"} alignItems={"center"} gap={8}>
            <Text fontSize="18px">Are you sure you want to delete the event?</Text>

            <Box display={"flex"} justifyContent={"space-around"} width={"50%"} mb={6}>
              <Button onClick={onDeleteClose}>No</Button>

              <Button
                backgroundColor="red.300"
                _hover={{
                  background: "red.200",
                }}
                onClick={deleteEvent}
              >
                Yes
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditEvent;
