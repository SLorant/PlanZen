import React, { useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import axios from "axios";
import "../styles/rbc.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
const DnDCalendar = withDragAndDrop(Calendar);
import moment from "moment";
import "moment/dist/locale/en-gb";
import AddEvent from "../components/AddEvent";
import LoginCheckUtil from "../components/LoginCheckUtil";
import { useColorMode, useDisclosure } from "@chakra-ui/react";
import EditEvent from "../components/EditEvent";
import Wrapper from "../components/Wrapper";

const Calendar2 = () => {
  moment.locale("en-GB");
  const [allEvents, setAllEvents] = useState([]);
  /*   const { onOpen, isOpen, onClose } = useDisclosure(); */
  const localizer = momentLocalizer(moment); // or globalizeLocalizer
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  /*   const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure(); */
  const [loggedIn, setLoggedIn] = useState(false);
  const { colorMode } = useColorMode();

  useEffect(() => {
    try {
      fetchAllEvents();
    } catch (e) {
      console.error(e?.response?.data);
    }
  }, [loggedIn]);

  const fetchAllEvents = async () => {
    const result = await LoginCheckUtil();
    if (result) {
      try {
        const result = await axios.get("http://localhost:4000/events", {
          withCredentials: true,
        });
        const events = result?.data.items;

        for (const event of events) {
          const startDate = new Date(Date.parse(event.start));
          const endDate = new Date(Date.parse(event.end));
          event.start = startDate;
          event.end = endDate;
        }
        console.log(events[0].start);
        setAllEvents(events);
      } catch (e) {
        console.log(e?.response?.data);
      }
    }
  };
  //getter from db

  const onEventResize = async ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    setAllEvents((prevEvents) => {
      const filtered = prevEvents.filter((item) => item.id !== event.id);
      return [...filtered, updatedEvent];
    });
    try {
      await axios.post("http://localhost:4000/updateEvent", updatedEvent, {
        withCredentials: true,
      });
    } catch (e) {
      console.log(e?.respone?.data);
    }
  };

  const [hideEventLabels, setHideEventLabels] = useState(false);
  const [monthView, setMonthView] = useState(true);
  const handleViewChange = (view) => {
    console.log(view);
    if (view === Views.WEEK) {
      setHideEventLabels(true); // Hide event labels when week view is selected
    } else {
      setHideEventLabels(false); // Show event labels for other views
    }
    if (view === Views.MONTH) {
      setMonthView(true);
    } else {
      setMonthView(false);
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

  const [slotEvent, setSlotEvent] = useState({
    slotClicked: false,
    start: new Date(),
    end: new Date(),
  }); // State variable to control modal visibility
  const handleSelectSlot = (slotInfo) => {
    const start = slotInfo.start;
    const end = monthView ? new Date(slotInfo.end.getTime() - 86400000) : slotInfo.end;
    console.log(start);
    console.log(end);
    const isSameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDay() === end.getDay();

    console.log(isSameDay);
    setSlotEvent({
      slotClicked: true,
      start: slotInfo.start,
      end: end,
      multiday: !isSameDay,
    }); // Open AddEvent modal when slot is selected
  };

  const [editedEvent, setEditedEvent] = useState({});
  const handleEditEvent = (eventinfo) => {
    setEditedEvent(eventinfo);
    onEditOpen();
  };

  return (
    <Wrapper>
      <div className={(hideEventLabels ? "week-view" : "", colorMode === "dark" ? "dark" : "")}>
        <DnDCalendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          views={["month", "week", "day"]}
          endAccessor="end"
          onEventDrop={(slotInfo) => onEventResize(slotInfo)}
          onEventResize={(slotInfo) => onEventResize(slotInfo)}
          onView={handleViewChange}
          resizable
          selectable
          eventPropGetter={eventStyleGetter} // Add eventStyleGetter prop
          onSelectEvent={(eventInfo) => handleEditEvent(eventInfo)}
          onSelectSlot={handleSelectSlot} // Call handleSelectSlot function when slot is selected
          longPressThreshold={100}
        />
      </div>
      <AddEvent
        allEvents={allEvents}
        setAllEvents={setAllEvents}
        slotEvent={slotEvent}
        editing={false}
        fetchEvents={fetchAllEvents}
        /*   isOpen={isAddOpen}
        onOpen={onAddOpen}
        onClose={onAddClose} */
      />
      <EditEvent
        allEvents={allEvents}
        setAllEvents={setAllEvents}
        editedEvent={editedEvent}
        isOpen={isEditOpen}
        onOpen={onEditOpen}
        onClose={onEditClose}
        fetchEvents={fetchAllEvents}
      />
    </Wrapper>
  );
};

export default Calendar2;
