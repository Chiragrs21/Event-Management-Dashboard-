# Event Management Model

A comprehensive Event Management Model designed to streamline event handling with features such as an event page, attendee management, task tracker, and secure authentication.

## Features

- **Event Page**: Create, update, and delete events with ease.
- **Attendee Management**: Track attendees with proper record handling.
- **Task Tracker**: Keep track of tasks with an intuitive interface.
- **Authentication & Security**: Secure login and user authentication.
- **Tech Stack**:
  - Backend: Flask (located in the `backend/` folder).
  - Frontend: React.

## Installation Setup

Follow these steps to set up the project on your local machine:

### Prerequisites

- Node.js (v16.x or above)
- Python (v3.8 or above)
- MongoDB (if database configuration is required)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/event-management-model.git
   cd event-management-model
   ```

2. **Backend Setup:**

   - Navigate to the backend folder:
     ```bash
     cd backend
     ```
   - Create and activate a virtual environment:
     ```bash
     python -m venv venv
     source venv/bin/activate # For Linux/Mac
     venv\Scripts\activate   # For Windows
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Run the backend server:
     ```bash
     python app.py
     ```

3. **Frontend Setup:**

   - Navigate to the frontend folder:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```

4. **Access the Application:**

   - The frontend will be available at `http://localhost:3000`.
   - The backend will be running on `http://localhost:5000` (default).

## Preview Video

Here is a quick preview of the application:

[![Watch the video](https://img.youtube.com/vi/dJ3vCqCL_Ok/maxresdefault.jpg)](https://youtu.be/dJ3vCqCL_Ok)

### [Full Vedio](https://youtu.be/dJ3vCqCL_Ok)

## Contributing

Contributions are welcome! Please fork the repository and create a pull request for any changes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
