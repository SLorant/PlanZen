import axios from "axios";

const LoginCheckUtil = async (toast, needToast) => {
  try {
    const result = await axios.get("http://localhost:4000/check-logged-in", {
      withCredentials: true,
    });
    return result;
  } catch (e) {
    console.log(e.response.status);
    if (needToast) {
      if (e.response.status === 401) {
        toast({
          title: "Please log in",
          description: "You have to log in first to do this.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Unexpected error",
          description: "Something went wrong :c",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }
};

export default LoginCheckUtil;
