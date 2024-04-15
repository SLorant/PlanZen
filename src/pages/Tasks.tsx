import { Box, Button, Card, CardBody, Collapse, Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import SideMenu from "../components/SideMenu";
import { AddIcon } from "@chakra-ui/icons";
import AddTask from "../components/AddTask";
import LoginCheckUtil from "../utils/LoginCheckUtil";
import axios from "axios";

const Tasks = () => {
  const { isOpen, onToggle } = useDisclosure();

  const [allTasks, setAllTasks] = useState([]);
  /*   const { onOpen, isOpen, onClose } = useDisclosure(); */
  /*   const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure(); */
  /*   const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure(); */
  const [loggedIn /* setLoggedIn */] = useState(false);

  useEffect(() => {
    try {
      fetchAllTasks();
    } catch (e) {
      console.error(e?.response?.data);
    }
  }, [loggedIn]);

  const fetchAllTasks = async () => {
    const result2 = await LoginCheckUtil();
    if (result2) {
      try {
        const result = await axios.get("http://localhost:4000/tasks", {
          withCredentials: true,
        });
        const tasks = result?.data.items;
        console.log(result?.data.items);
        tasks.map((task) => {
          console.log(task.name);
        });
        setAllTasks(tasks);
      } catch (e) {
        console.log(e);
        console.log(e?.response?.data);
      }
    }
  };

  return (
    <Wrapper>
      <SideMenu />
      <Heading textAlign={"center"} mt={4}>
        Tasks
      </Heading>
      <AddTask />
      <Box padding={6}>
        {allTasks &&
          allTasks.map((task) => (
            <Card mt={6}>
              <CardBody>
                <Box>
                  <Flex justifyContent={"space-between"} alignItems={"center"}>
                    <Text fontSize={"xl"}>{task.name}</Text>
                    <Button onClick={onToggle}>
                      <AddIcon />
                    </Button>
                  </Flex>
                  <Box>
                    <Collapse in={isOpen} transition={{ /* exit: { delay: 1 }, */ enter: { duration: 0.3 } }}>
                      <Box p="20px" color="text" mt="4" backgroundColor={"bg"} rounded="md" shadow="md">
                        {task.description}
                      </Box>
                    </Collapse>
                  </Box>
                </Box>
              </CardBody>
            </Card>
          ))}
      </Box>
      <div>
        todo adding... options: <p>simple todo, Task todo</p>
        <p>Todo lasts until... one-time, every day (recurring) (make it into a habit?)</p>
      </div>
      <div>make it an event?</div>
      <h2>Current tasks</h2>
      {/*  <Button onClick={handleToggle}>Toggle</Button>
      <Collapse mt={4} in={show} >
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim
        keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
      </Collapse> */}
    </Wrapper>
  );
};

export default Tasks;
