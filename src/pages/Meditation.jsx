import Wrapper from "../components/Wrapper";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import SideMenu from "../components/SideMenu";
import { useState } from "react";
const Meditation = () => {
  const [selectedSound, setSelectedSound] = useState(null);
  const [minutes, setMinutes] = useState(0);

  // Function to handle sound selection
  const handleSelectSound = (sound) => {
    setSelectedSound(sound);
  };
  const backgroundSounds = [
    { label: "Nature Sounds", value: "nature" },
    { label: "Soft Music", value: "music" },
    { label: "White Noise", value: "whitenoise" },
    // Add more background sound options as needed
  ];

  return (
    <Wrapper>
      <SideMenu />
      <Heading as={"h1"} mt={0} textAlign={"center"}>
        Meditate
      </Heading>
      <Flex mt={10} gap={6} width={"100%"} justifyContent={"center"} placeItems={"center"}>
        <Box>
          <FormControl isInvalid={false}>
            <FormLabel>Title</FormLabel>
            <Input
              _focus={{ borderColor: "accent" }}
              type="text"
              value={minutes}
              size={"md"}
              onChange={(e) => setMinutes(e.target.value)}
            />
            <FormErrorMessage ml={1}></FormErrorMessage>
          </FormControl>
        </Box>
        <Select
          width={"300px"}
          placeholder="Select background sound"
          value={selectedSound}
          onChange={(e) => handleSelectSound(e.target.value)}
        >
          {backgroundSounds.map((sound) => (
            <option key={sound.value} value={sound.value}>
              {sound.label}
            </option>
          ))}
        </Select>
      </Flex>
    </Wrapper>
  );
};

export default Meditation;
