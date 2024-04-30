import Wrapper from "../components/Wrapper";
import { Box, Flex, FormControl, FormLabel, Heading, Select, Button, FormErrorMessage } from "@chakra-ui/react";
import SideMenu from "../components/SideMenu";
import { useState, useRef, useEffect } from "react";

const Meditation = () => {
  const [selectedSound, setSelectedSound] = useState("");
  const [minutes, setMinutes] = useState(0);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef(new Audio());

  const handleStart = () => {
    if (!minutes) {
      setError("Please select meditation length");
    } else {
      setError("");
      const timeInSeconds = parseInt(minutes) * 60;
      setTimeLeft(timeInSeconds);
      setIsRunning(true);
      setTimer(
        setInterval(() => {
          setTimeLeft((prevTimeLeft) => {
            if (prevTimeLeft === 0) {
              setTimer(null);
              setIsRunning(false);
              stopSound();
              clearInterval(timer);
              return 0;
            }
            return prevTimeLeft - 1;
          });
        }, 1000)
      );
      playSound();
    }
  };
  const playSound = () => {
    if (selectedSound) {
      audioRef.current.src = `/audio/${selectedSound}.mp3`;
      audioRef.current.loop = true;
      audioRef.current.play();
    }
  };
  const stopSound = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };
  const handleStop = () => {
    clearInterval(timer);
    setTimer(null);
    setTimeLeft(null);
    stopSound();
    setIsRunning(false);
  };

  useEffect(() => {
    if (!isRunning) {
      stopSound();
    }
  }, [isRunning]);

  // Function to handle sound selection
  const handleSelectSound = (sound) => {
    setSelectedSound(sound);
  };

  const backgroundSounds = [
    { label: "Ocean Sounds", value: "ocean" },
    { label: "Rain", value: "rain" },
    { label: "Calming Music", value: "softmusic" },
    { label: "Soft guitarre", value: "guitarre" },
  ];
  const minuteOptions = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 45, 60];
  return (
    <Wrapper>
      <SideMenu />
      <Heading as={"h1"} mt={[6, 0]} textAlign={"center"}>
        Meditate
      </Heading>
      <Flex gap={["40px", "20px"]} justifyContent={"center"} placeItems={"center"} flexDirection={"column"}>
        <Flex
          flexDirection={["column", "row"]}
          mt={10}
          gap={6}
          width={"100%"}
          justifyContent={"center"}
          placeItems={"center"}
        >
          <FormControl width={"300px"} isInvalid={error}>
            <FormLabel>Minutes</FormLabel>
            <Select placeholder="Select minutes" value={minutes} onChange={(e) => setMinutes(e.target.value)}>
              {minuteOptions.map((option) => (
                <option key={option} value={option} /*  style={{ background: "primary.200" }} */>
                  {option} Minute{option !== 1 ? "s" : ""}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
          <FormControl width={"300px"} isInvalid={false}>
            <FormLabel>Background sound</FormLabel>
            <Select placeholder="Nothing" value={selectedSound} onChange={(e) => handleSelectSound(e.target.value)}>
              {backgroundSounds.map((sound) => (
                <option key={sound.value} value={sound.value}>
                  {sound.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </Flex>
        {!isRunning ? (
          <Button
            colorScheme="primary"
            color={"darktext"}
            _hover={{ backgroundColor: "secondary.500" }}
            onClick={handleStart}
            disabled={minutes <= 0}
          >
            Start
          </Button>
        ) : (
          <Button
            colorScheme="primary"
            color={"darktext"}
            _hover={{ backgroundColor: "secondary.500" }}
            onClick={handleStop}
          >
            Stop
          </Button>
        )}
        {timeLeft !== null && isRunning && (
          <Box mt={4} textAlign="center">
            <Heading as="h2" size="lg">
              Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </Heading>
          </Box>
        )}
      </Flex>
      <audio ref={audioRef} />
    </Wrapper>
  );
};

export default Meditation;
