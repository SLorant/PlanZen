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
import axios from "axios";
import { usePocket } from "../../contexts/PocketContext";

const EditEvent = ({ editedEvent, isOpen, onOpen, onClose, allEvents, setAllEvents, fetchEvents }) => {
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();
  const { user } = usePocket();

  const deleteEvent = async () => {
    if (user && editedEvent.id) {
      try {
        const result = await axios.delete(
          `${import.meta.env.VITE_LIVE_SERVER}/deleteEvent`,
          {
            data: { id: editedEvent.id, userID: user.id },
          },
          {
            withCredentials: false,
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
          <ModalHeader>{editedEvent.title}</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              onClose();
            }}
          />
          <ModalBody display={"flex"} flexDirection={"column"} alignItems={"center"} gap={8}>
            {/*  <Text fontSize={18}>Event title: {editedEvent.title}</Text> */}
            <Box mb={6} display={"flex"} justifyContent={"space-around"} placeItems={"center"} width={"100%"}>
              <AddEvent
                allEvents={allEvents}
                setAllEvents={setAllEvents}
                slotEvent={editedEvent}
                editing={true}
                fetchAllEvents={fetchEvents}
              />

              <Button
                backgroundColor="red.300"
                onClick={onDeleteOpen}
                color={"darktext"}
                _hover={{
                  background: "red.200",
                }}
              >
                Delete event
              </Button>
            </Box>
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
