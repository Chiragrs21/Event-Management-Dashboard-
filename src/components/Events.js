import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../Stylesheet/Events.css";

const Events = () => {
    const { eventId } = useParams(); // Get the eventId from URL params
    const [event, setEvent] = useState(null);
    const [showAttendeeForm, setShowAttendeeForm] = useState(false); // State to control the form visibility
    const [attendee, setAttendee] = useState({
        name: "",
        college: "",
        location: "",
        rank: "",
    });
    const [attendees, setAttendees] = useState([]); // State to hold list of attendees

    // Fetch the event details by eventId
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/get_event/${eventId}`);
                setEvent(response.data);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        const fetchAttendees = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/get_attendees/${eventId}`);
                setAttendees(response.data);
            } catch (error) {
                console.error("Error fetching attendees:", error);
            }
        };

        fetchEvent();
        fetchAttendees();
    }, [eventId]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setAttendee((prev) => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", attendee.name);
        formData.append("college", attendee.college);
        formData.append("location", attendee.location);
        formData.append("rank", attendee.rank);

        try {
            const response = await axios.post(
                `http://localhost:5000/add_attendee/${eventId}`,
                formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }
            );
            alert(response.data.message);
            setShowAttendeeForm(false); // Close the form after submission
            // Re-fetch the attendees after submission
            // This is now called within the try block
        } catch (error) {
            console.error("Error adding attendee:", error);
            alert("Error adding attendee");
        }
    };

    if (!event) return <div>Loading...</div>;

    return (
        <div className="event-detail-container">


            <div className="event-banner-container">
                <img
                    src={`http://localhost:5000/uploads/${event.banner}`}
                    alt="Event Banner"
                    className="event-banner"
                />
                <div className="banner-text">
                    <h2>{event.event_name}</h2>
                    <p className="event-description">{event.description}</p>
                </div>
            </div>

            <div className="attendee-button-container">
                <button className="attendee-button" onClick={() => setShowAttendeeForm(true)}>
                    Add Attendee
                </button>
            </div>

            {/* Table of Attendees - positioned above the banner */}
            <div className="attendee-list-container">
                <h3>Attendees List</h3>
                <table className="attendee-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>College</th>
                            <th>Location</th>
                            <th>Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendees.map((attendee) => (
                            <tr key={attendee._id}>
                                <td>{attendee.name}</td>
                                <td>{attendee.college}</td>
                                <td>{attendee.location}</td>
                                <td>{attendee.rank}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Show attendee form */}
            {showAttendeeForm && (
                <div className="attendee-form-container">
                    <form onSubmit={handleFormSubmit} className="attendee-form">
                        <h3>Add Attendee</h3>
                        <div className="form-group">
                            <label>Attendee Name</label>
                            <input
                                type="text"
                                name="name"
                                value={attendee.name}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>College Name</label>
                            <input
                                type="text"
                                name="college"
                                value={attendee.college}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={attendee.location}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Rank</label>
                            <input
                                type="text"
                                name="rank"
                                value={attendee.rank}
                                onChange={handleFormChange}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Submit</button>
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => setShowAttendeeForm(false)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Events;
