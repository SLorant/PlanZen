import {
  Modal,
  Drawer,
  Button,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalFooter,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

const isMobile = window.innerWidth <= 768;

const componentMap = {
  Button: Button,
  Component: isMobile ? Drawer : Modal,
  Body: isMobile ? DrawerBody : ModalBody,
  Footer: isMobile ? DrawerFooter : ModalFooter,
  Header: isMobile ? DrawerHeader : ModalHeader,
  Overlay: isMobile ? DrawerOverlay : ModalOverlay,
  Content: isMobile ? DrawerContent : ModalContent,
  CloseButton: isMobile ? DrawerCloseButton : ModalCloseButton,
};

export default componentMap;
