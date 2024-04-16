import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import componentMap from "../../utils/formMapUtil";

const Login = ({ setLoggedIn = null }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pError, setPError] = useState("");
  const [nameError, setNameError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const initialRef = React.useRef(null);
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    let hasErrors = false;
    if (!username) {
      setNameError("Username required");
      hasErrors = true;
    }
    if (!password) {
      setPError("Password required");
      hasErrors = true;
    }
    if (!hasErrors) {
      try {
        await axios.post(
          "http://localhost:4000/login",
          {
            username,
            password,
          },
          {
            withCredentials: true,
          }
        );
        toast({
          title: "Login successful",
          description: "You have successfully logged in.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        if (setLoggedIn) {
          setLoggedIn(true);
        }
      } catch (error) {
        setError(error?.response?.data);
      }
    }
  };

  return (
    <>
      <Button mt={6} onClick={onOpen} textColor={"darktext"} colorScheme="secondary" w="100%">
        Login
      </Button>

      <Modal closeOnOverlayClick={false} size={"sm"} initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Log in</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={nameError}>
              <FormLabel>Username</FormLabel>
              <Input
                _focus={{ borderColor: "accent" }}
                ref={initialRef}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <FormErrorMessage ml={1}>{nameError}</FormErrorMessage>
            </FormControl>

            <FormControl mt={4} isInvalid={pError}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  focusBorderColor={"primary"}
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage ml={1}>{pError}</FormErrorMessage>
            </FormControl>
            {error && (
              <Text mt={2} ml={1} color={"red"}>
                {error}
              </Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button color={"text"} mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button color={"text"} _hover={{ bg: "secondary" }} colorScheme={"primary"} onClick={handleLogin}>
              Log in
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Login;
