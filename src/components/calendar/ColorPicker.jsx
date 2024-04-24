import React, { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Center,
  SimpleGrid,
} from "@chakra-ui/react";

function ColorPicker({ newEvent, setNewEvent }) {
  const colors = [
    { value: "#43e56e", label: "Default" },
    { value: "#FEB2B2", label: "Red" },
    { value: "#CBD5E0", label: "Gray" },
    { value: "#9AE6B4", label: "Green" },
    { value: "#90cdf4", label: "Blue" },
    { value: "#81E6D9", label: "Teal" },
    { value: "#FAF089", label: "Yellow" },
    { value: "#FBD38D", label: "Orange" },
    { value: "#D6BCFA", label: "Purple" },
    { value: "#FBB6CE", label: "Pink" },
  ];

  const [color, setColor] = useState(colors[0]);

  useEffect(() => {
    if (newEvent.color) {
      const currColor = colors.find((color) => color.value === newEvent.color);
      setColor(currColor);
    }
  }, [newEvent]);

  return (
    <Popover variant="picker">
      <PopoverTrigger>
        <Button
          aria-label={color.label}
          background={color.value}
          height="22px"
          width="60px"
          padding={0}
          minWidth="unset"
          _hover={{ background: color.value }}
          _active={{ background: color.value }}
          borderRadius={3}
        ></Button>
      </PopoverTrigger>
      <PopoverContent width="200px">
        <PopoverArrow bg={color.value} />
        <PopoverCloseButton color="black" />
        <PopoverHeader
          height="100px"
          backgroundColor={color.value}
          borderTopLeftRadius={5}
          borderTopRightRadius={5}
          color="black"
        >
          <Center height="100%">{color.label}</Center>
        </PopoverHeader>
        <PopoverBody>
          <SimpleGrid columns={5} spacing={2}>
            {colors.map((c) => (
              <Button
                key={c.value}
                aria-label={c.label}
                background={c.value}
                height="24px"
                width="24px"
                padding={0}
                minWidth="unset"
                borderRadius={3}
                _hover={{ background: c.value }}
                _active={{ background: c.value }}
                onClick={() => {
                  setColor(c);
                  setNewEvent((prevEvent) => ({
                    ...prevEvent,
                    color: c.value,
                  }));
                }}
              ></Button>
            ))}
          </SimpleGrid>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default ColorPicker;
