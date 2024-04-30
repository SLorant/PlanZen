import React from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { useColorModeValue } from "@chakra-ui/react";

const DatePicker = ({ newEvent, setNewEvent, start, recurring }) => {
  const color = useColorModeValue("gray.200", "gray.600");
  const propConfig = {
    dateNavBtnProps: {
      background: color,
    },
    dayOfMonthBtnProps: {
      defaultBtnProps: {
        _hover: {
          background: "var(--secondary)",
          color: "var(--darktext)",
        },
      },
      selectedBtnProps: {
        background: "var(--primary)",
        color: "var(--darktext)",
      },
    },
  };
  return (
    <>
      {start ? (
        <SingleDatepicker
          id="date"
          style={{ background: "red" }}
          name="date-input"
          date={newEvent.start}
          propsConfigs={propConfig}
          onDateChange={(start) => setNewEvent({ ...newEvent, start })}
        />
      ) : recurring ? (
        <SingleDatepicker
          id="date"
          style={{ background: "red" }}
          name="date-input"
          date={newEvent.until ?? newEvent.end}
          propsConfigs={propConfig}
          onDateChange={(until) => setNewEvent({ ...newEvent, until })}
        />
      ) : (
        <SingleDatepicker
          id="date"
          style={{ background: "red" }}
          name="date-input"
          date={newEvent.end}
          propsConfigs={propConfig}
          onDateChange={(end) => setNewEvent({ ...newEvent, end })}
        />
      )}
    </>
  );
};

export default DatePicker;
