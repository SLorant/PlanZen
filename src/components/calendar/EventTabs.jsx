import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Text,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import DatePicker from "./DatePicker";

const EventTabs = ({
  multiday,
  setMultiday,
  isRecurring,
  setIsSimple,
  setIsRecurring,
  errors,
  startTime,
  endTime,
  newEvent,
  setNewEvent,
  setStartTime,
  setEndTime,
}) => {
  return (
    <Tabs index={multiday ? 1 : isRecurring ? 2 : 0} width={"100%"} mt={4} variant="unstyled" isFitted>
      <TabList>
        <Tab
          onClick={() => {
            setIsSimple(true);
            setMultiday(false);
            setIsRecurring(false);
          }}
        >
          One-time
        </Tab>
        <Tab
          onClick={() => {
            setMultiday(true);
            setIsRecurring(false);
            setIsSimple(false);
          }}
        >
          Multi-day
        </Tab>
        <Tab
          onClick={() => {
            setIsRecurring(true);
            setIsSimple(false);
            setMultiday(false);
          }}
        >
          Weekly
        </Tab>
      </TabList>
      <TabIndicator mt="-1.5px" height="2px" bg="accent" borderRadius="1px" />
      <TabPanels>
        <TabPanel paddingLeft={1}>
          <FormControl mt={2} isInvalid={errors.start}>
            <FormLabel>Start time</FormLabel>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              _focus={{ borderColor: "accent" }}
            />
            <FormErrorMessage ml={1}>{errors.start}</FormErrorMessage>
          </FormControl>
          <FormControl mt={4} isInvalid={errors.end}>
            <FormLabel>End time</FormLabel>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              _focus={{ borderColor: "accent" }}
            />
            <FormErrorMessage ml={1}>{errors.end}</FormErrorMessage>
          </FormControl>
        </TabPanel>
        <TabPanel paddingLeft={1}>
          <FormControl mt={2}>
            <FormLabel>End date</FormLabel>
            <DatePicker newEvent={newEvent} setNewEvent={setNewEvent} start={false} />
            <FormErrorMessage ml={1}></FormErrorMessage>
          </FormControl>
        </TabPanel>
        <TabPanel paddingLeft={1} paddingTop={1}>
          {/*          <Text fontStyle={"italic"} textAlign={"right"} fontSize={"sm"}>
            Recurs weekly
          </Text> */}
          <FormControl mt={4} isInvalid={errors.start}>
            <FormLabel>Start time</FormLabel>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              _focus={{ borderColor: "accent" }}
            />
            <FormErrorMessage ml={1}>{errors.start}</FormErrorMessage>
          </FormControl>
          <FormControl mt={4} isInvalid={errors.end}>
            <FormLabel>End time</FormLabel>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              _focus={{ borderColor: "accent" }}
            />
            <FormErrorMessage ml={1}>{errors.end}</FormErrorMessage>
          </FormControl>
          <FormControl mt={4} isInvalid={errors.until}>
            <FormLabel>Until</FormLabel>
            <DatePicker newEvent={newEvent} setNewEvent={setNewEvent} start={false} recurring={isRecurring} />
            <FormErrorMessage ml={1}>{errors.until}</FormErrorMessage>
          </FormControl>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default EventTabs;
