import React from "react";
import { useState, useRef, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import AddEvent from "./AddEvent";

const EditEvent = ({ editedEvent, isOpen, onOpen, onClose, allEvents, setAllEvents }) => {
  /*  const { onClose } = useDisclosure(); */
  console.log(editedEvent);
  return (
    <Modal size={"sm"} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit event</ModalHeader>
        <ModalCloseButton
          onClick={() => {
            onClose();
          }}
        />
        <ModalBody>
          <AddEvent allEvents={allEvents} setAllEvents={setAllEvents} slotEvent={editedEvent} editing={true} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditEvent;
