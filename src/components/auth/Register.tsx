import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  InputGroup,
  InputRightElement,
  FormHelperText,
  FormErrorMessage,
  Text,
  useToast,
  Button,
} from "@chakra-ui/react";
import componentMap from "../../utils/formMapUtil";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
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
    if (password !== passwordConfirm) {
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
            passwordConfirm,
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
    setPasswordConfirm("");
    clearErrors();
  }, [isOpen]);

  const isMobile = window.innerWidth <= 768;

  return (
    <>
      <Button mt={6} onClick={onOpen} textColor={"darktext"} colorScheme="secondary" w="100%">
        Register
      </Button>

      <componentMap.Component
        closeOnOverlayClick={!isMobile}
        size={"sm"}
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <componentMap.Overlay />
        <componentMap.Content>
          <componentMap.Header>Register</componentMap.Header>
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
                  <componentMap.Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </componentMap.Button>
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
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />

              <FormErrorMessage ml={1}>{paError}</FormErrorMessage>
            </FormControl>
            {error && (
              <Text mt={2} ml={1} color={"red"}>
                {error}
              </Text>
            )}
          </componentMap.Body>

          <componentMap.Footer>
            <Button colorScheme="blue" mr={3} onClick={handleRegister}>
              Register
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </componentMap.Footer>
        </componentMap.Content>
      </componentMap.Component>
    </>
  );
};

export default Register;
