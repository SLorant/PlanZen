import React from "react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";

const DatePicker = ({ newEvent, setNewEvent, start }) => {
  const propConfig = {
    dateNavBtnProps: {
      colorScheme: "primary",
      variant: "outline",
    },
    dayOfMonthBtnProps: {
      defaultBtnProps: {
        borderColor: "red.300",
        _hover: {
          background: "blue.400",
        },
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