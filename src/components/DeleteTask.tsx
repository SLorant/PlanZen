import React from "react";
import { Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import LoginCheckUtil from "../utils/LoginCheckUtil";

const DeleteTask = ({ fetchTasks, taskID }) => {
  const toast = useToast();
  const deleteTask = async () => {
    const result = await LoginCheckUtil();
    if (result && taskID) {
      try {
        const result = await axios.delete(
          "http://localhost:4000/deleteTask",
          {
            data: { id: taskID },
          },
          {
            withCredentials: true,
          }
        );
        console.log(result);
        if (result) {
          toast({
            title: `Task deleted succesfully`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          fetchTasks();
        }
      } catch (e) {
        console.log(e?.response?.data);
      }
    }
  };

  return (
    <>
      <Button
        size={"sm"}
        backgroundColor="red.300"
        onClick={deleteTask}
        _hover={{
          background: "red.200",
        }}
        padding={"7px"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-trash"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="#000000"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M4 7l16 0" />
          <path d="M10 11l0 6" />
          <path d="M14 11l0 6" />
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
        </svg>
      </Button>
    </>
  );
};

export default DeleteTask;
