import React, { useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

import "../styles/rbc.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
const DnDCalendar = withDragAndDrop(Calendar);
import moment from "moment";
import "moment/dist/locale/en-gb";
import EventAdder from "../components/EventAdder";

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
      color: "#ccc", // Default color
    },
    {
      id: "asd3",
      title: "Conference",
      start: new Date(2024, 3, 20),
      end: new Date(2024, 3, 23),
    },
  ];

  //getter from db
  const [allEvents, setAllEvents] = useState(events);

  const onEventResize = ({ event, start, end, isAllDay }) => {
    const updatedEvent = { ...event, start, end, isAllDay };
    // Any other logic. If async saving your change, you'll probably
    // do the next line in a `.then()`
    setAllEvents((prevEvents) => {
      const filtered = prevEvents.filter((item) => item.id !== event.id);
      return [...filtered, updatedEvent];
    });
  };

  const onEventDrop = ({ event, start, end, isAllDay }) => {
    const updatedEvent = { ...event, start, end, isAllDay };
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

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
    },
  });

  useEffect(() => {
    console.log(allEvents);
  }, [allEvents]);
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
          resizable
          eventPropGetter={eventStyleGetter} // Add eventStyleGetter prop
        />
      </div>
      <h2>add new</h2>
      <EventAdder allEvents={allEvents} setAllEvents={setAllEvents} />
    </div>
  );
};

export default Calendar2;
