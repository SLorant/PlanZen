import { usePocket } from "../contexts/PocketContext";

const LoginCheckUtil = async (toast = null, message = "") => {
  const { user } = usePocket();
  if (user) return true;
  else {
    if (toast !== null) {
      toast({
        title: "Please log in",
        description: message ? `You have to log in first ${message}` : "You have to log in first to do this.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    return false;
  }
};

export default LoginCheckUtil;
