import axios from "axios";

const LoginCheckUtil = async (toast = null, message = "") => {
  try {
    const result = await axios.get(`${import.meta.env.VITE_LIVE_SERVER}/check-logged-in`, {
      withCredentials: false,
    });
    return result;
  } catch (e) {
    if (toast !== null) {
      if (e.response.status === 401) {
        toast({
          title: "Please log in",
          description: message ? `You have to log in first ${message}` : "You have to log in first to do this.",
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
    return false;
  }
};

export default LoginCheckUtil;
