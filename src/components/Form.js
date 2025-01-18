import React, { useState } from "react";
import axios from "axios";
import "../Stylesheet/Form.css";

const Form = ({ show, onClose }) => {
    const [eventName, setEventName] = useState("");
    const [description, setDescription] = useState("");
    const [teamName, setTeamName] = useState("");
    const [banner, setBanner] = useState(null);

    const handleFileChange = (e) => {
        setBanner(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!eventName || !description || !teamName || !banner) {
            alert("All fields are required!");
            return;
        }

        const formData = new FormData();
        formData.append("event_name", eventName);
        formData.append("description", description);
        formData.append("team_name", teamName);
        formData.append("banner", banner);

        try {
            const response = await axios.post("http://localhost:5000/add_event", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert(response.data.message);
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
            alert("Error adding event: " + errorMessage);
        }
    };

    if (!show) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add Event</h2>
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
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                </form>
                <button onClick={onClose} className="close-button">Close</button>
            </div>
        </div>
    );
};

export default Form;

/* Form.css */

