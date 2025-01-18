from flask import Flask, request, jsonify, send_from_directory
from flask_pymongo import PyMongo
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS  # Import CORS
from bson import ObjectId  # Import ObjectId to handle MongoDB IDs

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/events"
mongo = PyMongo(app)

# File upload settings
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

# Check if file extension is allowed


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/get_attendees/<event_id>', methods=['GET'])
def get_attendees(event_id):
    try:
        # Fetch all attendees for the given event
        attendees_collection = mongo.db.attendees
        attendees = list(attendees_collection.find({"event_id": event_id}))

        # Convert MongoDB cursor to a list of dictionaries
        for attendee in attendees:
            # Convert ObjectId to string
            attendee['_id'] = str(attendee['_id'])

        return jsonify(attendees), 200
    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error fetching attendees."}), 500


@app.route('/signup', methods=['POST'])
def signup():
    try:
        users_collection = mongo.db.users

        # Check if required fields are present
        if not all(key in request.json for key in ('username', 'email', 'password')):
            return jsonify({"message": "Missing required fields"}), 400

        username = request.json['username']
        email = request.json['email']
        password = request.json['password']

        # Check if user already exists
        if users_collection.find_one({"email": email}):
            return jsonify({"message": "User already exists"}), 400

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Insert user data
        user_data = {
            "username": username,
            "email": email,
            "password": hashed_password
        }
        user_id = users_collection.insert_one(user_data).inserted_id

        return jsonify({"message": "User registered successfully", "user_id": str(user_id)}), 201

    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error during signup"}), 500


# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    try:
        users_collection = mongo.db.users

        # Check if required fields are present
        if not all(key in request.json for key in ('email', 'password')):
            return jsonify({"message": "Missing required fields"}), 400

        email = request.json['email']
        password = request.json['password']

        # Find user by email
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"message": "Invalid email or password"}), 401

        # Verify the password
        if not check_password_hash(user['password'], password):
            return jsonify({"message": "Invalid email or password"}), 401

        return jsonify({"message": "Login successful", "user_id": str(user['_id']), "username": user['username']}), 200

    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error during login"}), 500


# New route for adding attendee
@app.route('/add_attendee/<event_id>', methods=['POST'])
def add_attendee(event_id):
    try:
        # Check if all required form fields are present
        if 'name' not in request.form or 'college' not in request.form or 'location' not in request.form or 'rank' not in request.form:
            return jsonify({"message": "Missing required fields"}), 400

        # Retrieve form data for attendee
        name = request.form['name']
        college = request.form['college']
        location = request.form['location']
        rank = request.form['rank']

        # Fetch the event name based on the event_id
        events_collection = mongo.db.events
        event = events_collection.find_one({"_id": ObjectId(event_id)})

        if not event:
            return jsonify({"message": "Event not found"}), 404

        event_name = event['event_name']

        # Create an attendee document
        attendee_data = {
            "name": name,
            "college": college,
            "location": location,
            "rank": rank,
            "event_name": event_name,
            "event_id": event_id  # Link to the event ID
        }

        # Insert the attendee into the MongoDB collection
        attendees_collection = mongo.db.attendees
        attendee_id = attendees_collection.insert_one(
            attendee_data).inserted_id

        return jsonify({"message": "Attendee added successfully", "attendee_id": str(attendee_id)}), 200

    except Exception as e:
        print(str(e))
        return jsonify({"message": str(e)}), 500


@app.route('/add_event', methods=['POST'])
def add_event():
    try:
        # Retrieve form data
        event_name = request.form['event_name']
        description = request.form['description']
        team_name = request.form['team_name']

        # Handle banner file upload
        if 'banner' not in request.files:
            return jsonify({"message": "No banner file part"}), 400

        banner = request.files['banner']
        if banner.filename == '':
            return jsonify({"message": "No selected file"}), 400

        if banner and allowed_file(banner.filename):
            # Secure the filename
            filename = secure_filename(banner.filename)
            banner.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        else:
            return jsonify({"message": "Invalid file format"}), 400

        # Create a new event document to insert into MongoDB
        event_data = {
            "event_name": event_name,
            "description": description,
            "team_name": team_name,
            "banner": filename
        }

        # Insert the event data into the MongoDB collection
        events_collection = mongo.db.events
        event_id = events_collection.insert_one(event_data).inserted_id

        return jsonify({"message": "Event added successfully", "event_id": str(event_id)}), 200

    except Exception as e:
        print(str(e))
        return jsonify({"message": str(e)}), 500


@app.route('/get_events', methods=['GET'])
def get_events():
    try:
        # Fetch all events from MongoDB
        events_collection = mongo.db.events
        events = events_collection.find()

        # Convert MongoDB cursor to a list of dictionaries
        event_list = []
        for event in events:
            event['_id'] = str(event['_id'])  # Convert ObjectId to string
            event_list.append(event)

        return jsonify({"events": event_list}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error fetching events."}), 500


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/get_event/<event_id>', methods=['GET'])
def get_event(event_id):
    try:
        # Find the event by ID
        events_collection = mongo.db.events
        event = events_collection.find_one({"_id": ObjectId(event_id)})

        if not event:
            return jsonify({"message": "Event not found"}), 404

        event['_id'] = str(event['_id'])  # Convert ObjectId to string
        return jsonify(event), 200

    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error fetching event."}), 500


@app.route('/edit_event/<event_id>', methods=['PUT'])
def edit_event(event_id):
    try:
        # Retrieve the updated event data
        event_name = request.form['event_name']
        description = request.form['description']
        team_name = request.form['team_name']

        # Handle the banner update
        banner = None
        if 'banner' in request.files:
            banner = request.files['banner']
            if banner.filename != '':
                if allowed_file(banner.filename):
                    filename = secure_filename(banner.filename)
                    banner.save(os.path.join(
                        app.config['UPLOAD_FOLDER'], filename))
                else:
                    return jsonify({"message": "Invalid file format"}), 400

        # Update the event data in MongoDB
        events_collection = mongo.db.events
        update_data = {
            "event_name": event_name,
            "description": description,
            "team_name": team_name,
        }

        if banner:
            update_data["banner"] = filename

        result = events_collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return jsonify({"message": "Event not found"}), 404

        return jsonify({"message": "Event updated successfully"}), 200

    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error updating event."}), 500


@app.route('/delete_event/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        # Find the event by ID and delete it
        events_collection = mongo.db.events
        result = events_collection.delete_one({"_id": ObjectId(event_id)})

        if result.deleted_count == 0:
            return jsonify({"message": "Event not found"}), 404

        return jsonify({"message": "Event deleted successfully"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"message": "Error deleting event."}), 500


if __name__ == "__main__":
    app.run(debug=True)
