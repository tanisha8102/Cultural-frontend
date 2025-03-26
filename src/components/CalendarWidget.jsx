import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "../styles/CalendarWidget.css";

const CalendarWidget = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const filteredEvents = events.filter(
      (event) =>
        new Date(event.dateTime).toISOString().split("T")[0] === formattedDate
    );
    setSelectedEvents(filteredEvents);
  };

  return (
    <div className="calendar-container">
      <Calendar
        onChange={handleDateChange}
        value={date}
        prev2Label={null}
        next2Label={null}
        nextLabel="›"
        prevLabel="‹"
        tileClassName={({ date }) => {
          const formattedDate = date.toISOString().split("T")[0];
          return events.some(
            (event) =>
              new Date(event.dateTime).toISOString().split("T")[0] ===
              formattedDate
          )
            ? "event-highlight"
            : null;
        }}
      />

      <div className="event-list">
        <h4>Events on {date.toDateString()}</h4>
        {selectedEvents.length > 0 ? (
          <ul>
            {selectedEvents.map((event) => (
              <li key={event.id}>
                <strong>{event.name}</strong>
                <p>{event.description}</p>
                <span>{new Date(event.dateTime).toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-events">No events on this day</p>
        )}
      </div>
    </div>
  );
};

export default CalendarWidget;
