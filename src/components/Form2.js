import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Stylesheet/Form2.css";

const Form2 = ({ show, onClose, eventId, fetchEventData }) => {
    const [eventName, setEventName] = useState("");
    const [description, setDescription] = useState("");
    const [teamName, setTeamName] = useState("");
    const [banner, setBanner] = useState(null);

    // Fetch event data for editing
    useEffect(() => {
        if (eventId) {
            const fetchEvent = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/get_event/${eventId}`);
                    const { event_name, description, team_name } = response.data;
                    setEventName(event_name);
                    setDescription(description);
                    setTeamName(team_name);
                    // Don't set banner as it is a file, handle it separately when editing
                } catch (error) {
                    alert("Error fetching event data");
                }
            };
            fetchEvent();
        }
    }, [eventId]);  // Re-fetch event data when eventId changes

    const handleFileChange = (e) => {
        setBanner(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!eventName || !description || !teamName || (eventId && !banner)) {
            alert("All fields are required!");
            return;
        }

        const formData = new FormData();
        formData.append("event_name", eventName);
        formData.append("description", description);
        formData.append("team_name", teamName);
        if (banner) {
            formData.append("banner", banner);
        }

        try {
            let response;
            if (eventId) {
                // Edit event
                response = await axios.put(`http://localhost:5000/edit_event/${eventId}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            } else {
                // Add new event
                response = await axios.post("http://localhost:5000/add_event", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
            }
            alert(response.data.message);
            onClose();
            fetchEventData(); // Reload events after submission
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            alert("Error: " + errorMessage);
        }
    };

    // Handle delete event
    const handleDelete = async () => {
        if (!eventId) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this event?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`http://localhost:5000/delete_event/${eventId}`);
            alert(response.data.message);
            onClose();
            fetchEventData(); // Reload events after deletion
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error deleting event.";
            alert("Error: " + errorMessage);
        }
    };

    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{eventId ? "Edit Event" : "Add Event"}</h2>
                <form onSubmit={handleSubmit} className="form-container">
                    <div className="form-group">
                        <label>Event Name</label>
                        <input
                            type="text"
                            placeholder="Enter event name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            placeholder="Enter event description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Organizing Team Name</label>
                        <input
                            type="text"
                            placeholder="Enter team name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Event Banner</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            required={!eventId} // Make file upload mandatory if it's a new event
                        />
                    </div>
                    <button type="submit" className="submit-button">{eventId ? "Update Event" : "Submit"}</button>
                    {eventId && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="delete-button"
                        >
                            <i className="delete-icon">🗑️</i> Delete Event
                        </button>
                    )}
                </form>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
};

export default Form2;
