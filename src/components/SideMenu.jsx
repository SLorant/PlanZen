import { CalendarIcon, EditIcon, HamburgerIcon, MoonIcon } from "@chakra-ui/icons";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Box,
  Divider,
  useColorMode,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import LoginCheckUtil from "../utils/LoginCheckUtil";
import axios from "axios";
import { AuthContext } from "../utils/AuthContext";
const SideMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const { toggleColorMode } = useColorMode();
  const { loggedIn, setLoggedIn } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    if (isOpen || initial) {
      console.log("start");
      checkLoggedIn();
      setInitial(false);
    }
  }, [isOpen]);

  const checkLoggedIn = async () => {
    const result = await LoginCheckUtil();
    console.log(result);
    if (result) {
      await getUserInfo();
      setLoggedIn(true);
    }
  };

  const getUserInfo = async () => {
    try {
      const result = await axios.get("http://localhost:4000/userInfo", {
        withCredentials: true,
      });
      console.log(result?.data);
      if (result?.data?.username) setUserName(result?.data?.username);
      if (result?.data?.email) setEmail(result?.data?.email);
    } catch (e) {
      console.log(e);
      console.log(e?.response?.data);
    }
  };

  const handleLogout = async () => {
    setLoggedIn(false);
    try {
      await axios.delete("http://localhost:4000/logout", {
        withCredentials: true,
      });
    } catch (e) {
      console.log(e?.response?.data);
    }
  };
  return (
    <>
      <Button
        zIndex={50}
        ref={btnRef}
        position={["fixed", "absolute"]}
        top={6}
        left={[6, "30px"]}
        textColor={"darktext"}
        colorScheme={"secondary"}
        onClick={onOpen}
        padding={3}
      >
        <HamburgerIcon boxSize={5} />
      </Button>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Link to={"/"}>
              <Button
                textColor={"darktext"}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                colorScheme="secondary"
                w="100%"
                paddingInlineEnd={3}
              >
                <Box textAlign="center" flex="1" onClick={onClose}>
                  Home
                </Box>
                <svg
                  /*    style={{ marginLeft: "20px" }} */
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-home"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  strokeWidth="1.7"
                  stroke="#000000"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                </svg>
              </Button>
            </Link>

            <Link to={"/calendar"}>
              <Button
                mt={6}
                textColor={"darktext"}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                colorScheme="secondary"
                onClick={onClose}
                w="100%"
              >
                <Box textAlign="center" flex="1">
                  Calendar
                </Box>
                <CalendarIcon />
              </Button>
            </Link>

            <Link to={"/tasks"}>
              <Button
                mt={6}
                textColor={"darktext"}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                colorScheme="secondary"
                onClick={onClose}
                w="100%"
              >
                <Box textAlign="center" flex="1">
                  Tasks
                </Box>
                <EditIcon strokeWidth={3} />
              </Button>
            </Link>
            <Link to={"/meditation"}>
              <Button
                mt={6}
                textColor={"darktext"}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                colorScheme="secondary"
                onClick={onClose}
                w="100%"
              >
                <Box textAlign="center" flex="1">
                  Meditation
                </Box>
                <CalendarIcon />
              </Button>
            </Link>
            <Link to={"/calendar"}>
              <Button
                mt={6}
                textColor={"darktext"}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                colorScheme="secondary"
                onClick={onClose}
                w="100%"
              >
                <Box textAlign="center" flex="1">
                  Habit tracker
                </Box>
                <CalendarIcon />
              </Button>
            </Link>

            <Divider size={20} mt={6} backgroundColor={"secondary"} />
            {loggedIn ? (
              <Flex flexDirection={"column"} alignItems={"center"} justifyContent={"center"} mt={6}>
                <Text textAlign={"center"}>Logged in as {userName}</Text>
                <Text mt={2} textAlign={"center"}>
                  Email: {email}
                </Text>
                <Button mt={4} onClick={handleLogout}>
                  Logout
                </Button>
              </Flex>
            ) : (
              <>
                <Login setLoggedIn={setLoggedIn} />
                <Register />
              </>
            )}
          </DrawerBody>

          <DrawerFooter justifyContent={"start"}>
            <Button colorScheme="secondary" textColor={"darktext"} size="sm" onClick={toggleColorMode}>
              <MoonIcon boxSize={4} />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideMenu;
