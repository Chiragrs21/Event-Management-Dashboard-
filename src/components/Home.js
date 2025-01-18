import React, { useState, useEffect } from "react";
import Form2 from "./Form2";
import "../Stylesheet/Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [showForm, setShowForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null); // Store current event for editing

  const handleAddEventClick = () => {
    setCurrentEvent(null); // Reset to null for adding a new event
    setShowForm(true); // Show form for adding
  };

  const handleCloseForm = () => {
    setShowForm(false); // Hide form
  };

  const handleEditEventClick = (event) => {
    setCurrentEvent(event); // Set event to be edited
    setShowForm(true); // Show form for editing
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/get_events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events); // Set the events data
      } else {
        console.error("Failed to fetch events.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchEvents(); // Fetch events when the component mounts
  }, []);

  return (
    <div className="desktop">
      {/* Navigation Bar */}
      <div className="navigation">
        <div className="nav-item">Home</div>
        <div className="nav-item"><Link to="/tasks">Tasks Progress</Link></div>
        <div className="nav-item">About</div>
      </div>

      {/* Header Section */}
      <div className="header">
        <div className="header-title">Events</div>
        <div className="component">
          <button className="button" onClick={handleAddEventClick}>
            Add Event
          </button>
        </div>
      </div>

      {/* Form2 Component */}
      <Form2
        show={showForm}
        onClose={handleCloseForm}
        eventId={currentEvent?._id} // Pass only the eventId
        fetchEventData={fetchEvents} // Pass fetch function for reloading events
      />

      {/* Table Section */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Description</th>
              <th>Organization Team Name</th>
              <th>Status</th>
              <th>Action</th> {/* Action column for Edit */}
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event._id}>
                  <td><Link to={`/event/${event._id}`}>{event.event_name}</Link></td>
                  <td>{event.description}</td>
                  <td>{event.team_name}</td>
                  <td>Active</td>
                  <td>
                    <button
                      onClick={() => handleEditEventClick(event)} // Trigger edit
                      className="edit-button"
                    >
                      Edit
                    </button>
                  </td> {/* Edit button */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No events available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
