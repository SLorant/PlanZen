import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalBody,
  Button,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  useDisclosure,
  InputGroup,
  InputRightElement,
  FormHelperText,
  FormErrorMessage,
  Text,
  useToast,
} from "@chakra-ui/react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAg, setPasswordAg] = useState("");
  const [error, setError] = useState("");
  const [pError, setPError] = useState("");
  const [paError, setPaError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const initialRef = React.useRef(null);
  const toast = useToast();
  const clearErrors = () => {
    setError("");
    setPError("");
    setPaError("");
    setNameError("");
    setEmailError("");
  };

  const isValidEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    clearErrors();
    let hasErrors = false;
    if (password.length < 8) {
      setPError("Your password must contain at least 8 characters.");
      hasErrors = true;
    }
    if (password !== passwordAg) {
      setPaError("Passwords don't match");
      hasErrors = true;
    }
    if (!username) {
      setNameError("Username required");
      hasErrors = true;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please provide a valid email.");
      hasErrors = true;
    }
    if (!email) {
      setEmailError("Email required");
      hasErrors = true;
    }
    if (!hasErrors) {
      try {
        await axios.post(
          "http://localhost:4000/register",
          {
            username,
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );
        toast({
          title: "Registration successful",
          description: "You have successfully registered.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        setError(error?.response?.data);
      }
    }
  };

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordAg("");
    clearErrors();
  }, [isOpen]);
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal closeOnOverlayClick={false} size={"sm"} initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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
            <FormControl mt={4} isInvalid={emailError}>
              <FormLabel>Email</FormLabel>
              <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <FormErrorMessage ml={1}>{emailError}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={pError || paError}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {!pError ? (
                <FormHelperText ml={1}>At least 8 characters.</FormHelperText>
              ) : (
                <FormErrorMessage ml={1}>{pError}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isInvalid={paError}>
              <FormLabel>Password again</FormLabel>
              <Input
                type={show ? "text" : "password"}
                placeholder="Password confirm"
                value={passwordAg}
                onChange={(e) => setPasswordAg(e.target.value)}
              />

              <FormErrorMessage ml={1}>{paError}</FormErrorMessage>
            </FormControl>
            {error && (
              <Text mt={2} ml={1} color={"red"}>
                {error}
              </Text>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleRegister}>
              Register
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Register;
