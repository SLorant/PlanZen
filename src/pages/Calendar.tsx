import React from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { RangeDatepicker } from "chakra-dayzed-datepicker";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Button } from "@chakra-ui/react";
import "./rbc.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
const DnDCalendar = withDragAndDrop(Calendar);
import moment from "moment";
import "moment/dist/locale/en-gb";

const Calendar2 = () => {
  moment.locale("en-GB");

  const localizer = momentLocalizer(moment); // or globalizeLocalizer
  const events = [
    {
      id: "asd",
      title: "Big Meeting",
      start: new Date(2024, 3, 0, 12, 0, 0),
      end: new Date(2024, 3, 0, 14, 0, 0),
    },
    {
      id: "asd1",
      title: "Vacation",
      start: new Date(2024, 3, 7),
      end: new Date(2024, 3, 10),
    },
    {
      id: "asd2",
      title: "Vacation",
      start: new Date(2024, 3, 7),
      end: new Date(2024, 3, 10),
      isAllDay: true,
    },
    {
      id: "asd2",
      title: "Vacation",
      start: new Date(2024, 3, 7),
      end: new Date(2024, 3, 10),
      isAllDay: true,
    },
    {
      id: "asd2",
      title: "Vacation",
      start: new Date(2024, 3, 7),
      end: new Date(2024, 3, 10),
      isAllDay: true,
    },
    {
      id: "asd3",
      title: "Conference",
      start: new Date(2024, 3, 20),
      end: new Date(2024, 3, 23),
    },
  ];

  function handleAddEvent() {
    setAllEvents([...allEvents, newEvent]);
  }

  const [newEvent, setNewEvent] = useState({ title: "", start: new Date(), end: "" });
  const [allEvents, setAllEvents] = useState(events);
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);

  const propConfig = {
    dateNavBtnProps: {
      backgroundColor: "light.primary",
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

  const onEventResize = ({ event, start, end, isAllDay }) => {
    const updatedEvent = { ...event, start, end, isAllDay };
    // Add a class to the dropped event for the animation
    const eventElements = document.getElementsByClassName(`.rbc-addons-dnd-dragged-event`);
    console.log(eventElements);
    if (eventElements.length > 0) {
      eventElements.forEach((element) => {
        element.classList.add("event-drop");
        setTimeout(() => {
          element.classList.remove("event-drop");
        }, 500); // Adjust timing according to your animation duration
      });
    }
    // Any other logic. If async saving your change, you'll probably
    // do the next line in a `.then()`
    setAllEvents((prevEvents) => {
      const filtered = prevEvents.filter((item) => item.id !== event.id);
      return [...filtered, updatedEvent];
    });
  };

  const onEventDrop = ({ event, start, end, isAllDay }) => {
    const updatedEvent = { ...event, start, end, isAllDay };
    // Add a class to the dropped event for the animation
    const eventElements = document.getElementsByClassName(`.rbc-addons-dnd-drag-preview `);
    console.log(eventElements);
    if (eventElements.length > 0) {
      eventElements.forEach((element) => {
        element.classList.add("event-drop");
        setTimeout(() => {
          element.classList.remove("event-drop");
        }, 500); // Adjust timing according to your animation duration
      });
    }
    // Any other logic. If async saving your change, you'll probably
    // do the next line in a `.then()`
    setAllEvents((prevEvents) => {
      const filtered = prevEvents.filter((item) => item.id !== event.id);
      return [...filtered, updatedEvent];
    });
  };
  const [hideEventLabels, setHideEventLabels] = useState(false);
  const handleViewChange = (view) => {
    // Check if the selected view is week view
    console.log(view);
    if (view === Views.WEEK) {
      setHideEventLabels(true); // Hide event labels when week view is selected
    } else {
      setHideEventLabels(false); // Show event labels for other views
    }
  };
  return (
    <div>
      <div className={hideEventLabels ? "week-view" : ""}>
        <DnDCalendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          onView={handleViewChange}
          dateFormat="h t"
          /* onDragStart={() => {
          setTimeout(() => {
            const eventElement = document.querySelector(`.rbc-addons-dnd-drag-preview`);
            console.log(eventElement);
            if (eventElement) {
              eventElement.classList.add("event-dragging");
            }
          }, 500);
        }} */
          resizable
        />
      </div>
      <h2>add new</h2>
      <div>
        <input
          type="text"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <DatePicker
          placeholderText="asd"
          selected={newEvent.start}
          onChange={(start) => setNewEvent({ ...newEvent, start })}
        />
        <DatePicker
          placeholderText="asd2"
          selected={newEvent.end}
          onChange={(end) => setNewEvent({ ...newEvent, end })}
        />

        <SingleDatepicker
          name="date-input"
          date={newEvent.start}
          propsConfigs={propConfig}
          onDateChange={(start) => setNewEvent({ ...newEvent, start })}
        />
        <RangeDatepicker selectedDates={selectedDates} onDateChange={setSelectedDates} />
        <Button onClick={handleAddEvent}>add event</Button>
      </div>
    </div>
  );
};

export default Calendar2;
