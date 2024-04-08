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
} from "@chakra-ui/react";
import componentMap from "../utils/formMapUtil";

const Login = () => {
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
      } catch (error) {
        setError(error?.response?.data);
      }
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <componentMap.Component
        closeOnOverlayClick={false}
        size={"sm"}
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <componentMap.Overlay />
        <componentMap.Content>
          <componentMap.Header>Log in</componentMap.Header>
          <componentMap.CloseButton />
          <componentMap.Body pb={6}>
            <FormControl isInvalid={nameError}>
              <FormLabel>Username</FormLabel>
              <Input
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
                  focusBorderColor="light.accent"
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
          </componentMap.Body>

          <componentMap.Footer>
            <Button color={"light.text"} mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              color={"light.text"}
              _hover={{ bg: "light.secondary" }}
              backgroundColor={"light.primary"}
              onClick={handleLogin}
            >
              Log in
            </Button>
          </componentMap.Footer>
        </componentMap.Content>
      </componentMap.Component>
    </>
  );
};

export default Login;
