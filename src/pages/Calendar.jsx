import React, { useContext, useEffect } from "react";
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
import AddEvent from "../components/calendar/AddEvent";
import LoginCheckUtil from "../utils/LoginCheckUtil";
import { Heading, useColorMode, useDisclosure } from "@chakra-ui/react";
import EditEvent from "../components/calendar/EditEvent";
import Wrapper from "../components/Wrapper";
import SideMenu from "../components/SideMenu";
import { RRule } from "rrule";
import { AuthContext } from "../utils/AuthContext";

const Calendar2 = () => {
  moment.locale("en-GB");
  const [allEvents, setAllEvents] = useState([]);
  const localizer = momentLocalizer(moment);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { loggedIn } = useContext(AuthContext);
  const { colorMode } = useColorMode();
  const [slotEvent, setSlotEvent] = useState({
    slotClicked: false,
    start: new Date(),
    end: new Date(),
    new: true,
  });
  const [weekView, setWeekView] = useState(false);
  const [monthView, setMonthView] = useState(true);
  const [dayView, setDayView] = useState(true);
  const [fetchNew, setFetchNew] = useState(false);

  useEffect(() => {
    if (fetchNew) {
      fetchAllEvents();
    }
  }, [fetchNew]);

  useEffect(() => {
    try {
      if (loggedIn) fetchAllEvents();
      else setAllEvents([]);
    } catch (e) {
      console.error(e?.response?.data);
    }
  }, [loggedIn]);

  const fetchAllEvents = async () => {
    const result = await LoginCheckUtil();
    if (result) {
      try {
        const result = await axios.get(`${import.meta.env.VITE_LOCAL_SERVER}/events`, {
          withCredentials: false,
        });
        const events = result?.data.items;
        const recEvents = [];
        //Recurring weekly events need to be added more times to the calendar (until the end date)
        for (const event of events) {
          const startDate = new Date(Date.parse(event.start));
          const endDate = new Date(Date.parse(event.end));
          const until = event.until ? new Date(Date.parse(event.until)) : null;
          if (event.isRecurring) {
            const occurences = new RRule({
              freq: RRule.WEEKLY,
              dtstart: startDate,
              until: until ?? endDate,
            });
            for (const one of occurences.all()) {
              const recEvent = { ...event }; // Create a new object for each occurrence

              // Set the start date
              recEvent.start = new Date(one);
              recEvent.start.setHours(startDate.getHours());
              recEvent.start.setMinutes(startDate.getMinutes());

              // Set the end date
              recEvent.end = new Date(one);
              recEvent.end.setHours(endDate.getHours());
              recEvent.end.setMinutes(endDate.getMinutes());

              recEvents.push(recEvent);
            }
          } else {
            event.start = startDate;
            event.end = endDate;
            recEvents.push(event);
          }
        }
        setFetchNew(false);
        setAllEvents(recEvents);
      } catch (e) {
        console.log(e?.response?.data);
      }
    }
  };

  const onEventResize = async ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    //If event is recurring, and we are on week/day view, when the user moves an event
    //the corresponding event dates should update too. Without this feature, if the user
    // moves a recurring date that is not the first one, the new date would become the first
    if ((event.isRecurring && weekView) || dayView) {
      const events = allEvents.filter((item) => item.id === event.id);
      const oldestEvent = events.reduce((oldest, current) => {
        const oldestStartDate = new Date(oldest.start);
        const currentStartDate = new Date(current.start);
        return oldestStartDate < currentStartDate ? oldest : current;
      });

      const temp = updatedEvent.start;
      const differenceMs = updatedEvent.start.getTime() - event.start.getTime();
      const differenceDays = Math.round(differenceMs / (1000 * 60 * 60 * 24));

      oldestEvent.start.setDate(oldestEvent.start.getDate() + differenceDays);
      updatedEvent.start = oldestEvent.start;
      updatedEvent.start.setHours(temp.getHours());
      updatedEvent.start.setMinutes(temp.getMinutes());
    }

    setAllEvents((prevEvents) => {
      if (!event.isRecurring) {
        const filtered = prevEvents.filter((item) => item.id !== event.id);
        return [...filtered, updatedEvent];
      } else {
        setFetchNew(true);
      }
    });
    try {
      await axios.post(`${import.meta.env.VITE_LOCAL_SERVER}/updateEvent`, updatedEvent, {
        withCredentials: false,
      });
    } catch (e) {
      console.log(e?.response?.data);
    }
  };

  const handleViewChange = (view) => {
    if (view === Views.WEEK) {
      setWeekView(true);
    } else {
      setWeekView(false);
    }
    if (view === Views.MONTH) {
      setMonthView(true);
    } else {
      setMonthView(false);
    }
    if (view === Views.DAY) {
      setDayView(true);
    } else {
      setDayView(false);
    }
  };

  //Empty slot - new event
  const handleSelectSlot = (slotInfo) => {
    const start = slotInfo.start;
    const end = monthView ? new Date(slotInfo.end.getTime() - 86400000) : slotInfo.end;
    const isSameDay =
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDay() === end.getDay();

    setSlotEvent({
      slotClicked: true,
      start: slotInfo.start,
      end: end,
      multiday: !isSameDay,
      new: false,
    });
  };

  const [editedEvent, setEditedEvent] = useState({});
  const handleEditEvent = (eventinfo) => {
    setEditedEvent(eventinfo);
    onEditOpen();
  };

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
    },
  });

  return (
    <Wrapper>
      <SideMenu />
      <Heading textAlign={"center"} mt={[7, 0]} mb={2}>
        Calendar
      </Heading>
      <div className={(weekView ? "week-view" : "", colorMode === "dark" ? "dark" : "")}>
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
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(eventInfo) => handleEditEvent(eventInfo)}
          onSelectSlot={handleSelectSlot}
          longPressThreshold={100}
        />
      </div>
      <AddEvent
        allEvents={allEvents}
        setAllEvents={setAllEvents}
        slotEvent={slotEvent}
        editing={false}
        fetchAllEvents={fetchAllEvents}
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
