import React, { useEffect, useState } from "react";
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
  ModalOverlay,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { usePocket } from "../../contexts/PocketContext";

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

  const { register, login } = usePocket();

  const isValidEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    //Error handling
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
        await register(username, email, password);
        toast({
          title: "Registration successful",
          description: "You have successfully registered.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onClose();
        await login(username, password);
      } catch (error) {
        setError(error?.response?.data);
      }
    }
  };

  useEffect(() => {
    //Clear everything
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

      <Modal closeOnOverlayClick={!isMobile} size={"sm"} initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register</ModalHeader>
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
            <FormControl mt={4} isInvalid={emailError}>
              <FormLabel>Email</FormLabel>
              <Input
                _focus={{ borderColor: "accent" }}
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormErrorMessage ml={1}>{emailError}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={pError || paError}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  _focus={{ borderColor: "accent" }}
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
                _focus={{ borderColor: "accent" }}
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
          </ModalBody>

          <ModalFooter>
            <Button color={"text"} mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ backgroundColor: "secondary.500" }}
              color={"text"}
              colorScheme={"primary"}
              onClick={handleRegister}
            >
              Register
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Register;
