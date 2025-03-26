import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UpcomingEvents.css";
import noEvent from "../assets/no-event-bg.png";


const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data.slice(0, 4)); // Show only 4 events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="upcoming-events-container">
      <h3 className="section-title"></h3>
      <div className="events-list">
      {events.length > 0 ? (
  events.map((event) => {
    const eventDate = new Date(event.dateTime);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
    const time = eventDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return (
      <div key={event.id} className="up-event-card">
        <div className="event-date">
          <span className="event-time">{time}</span>
          <span className="event-day-month">{formattedDate}</span>
        </div>
        <div className="event-details">
          <h4>{event.name}</h4>
          <p>{event.description}</p>
        </div>
      </div>
    );
  })
) : (
  <div className="no-events-container">
    <img src={noEvent} alt="No Upcoming Events" className="no-upcoming-events-img"  style={{ width: "400px", height: "auto", opacity: 0.8 }} />
  </div>
)}

      </div>
      <div className="view-all-container">
        <a href="/events" className="view-all-button">View All Events →</a>
      </div>
    </div>
  );
};

export default UpcomingEvents;
