import React, { useState } from "react";
import "../Stylesheet/Tasks.css";
import { Link } from "react-router-dom";

const TaskProgress = () => {
    const [tasks, setTasks] = useState([]);
    const [showAddTaskForm, setShowAddTaskForm] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");

    // Add a new task
    const handleAddTask = () => {
        if (newTaskName.trim() === "") {
            alert("Task name cannot be empty");
            return;
        }
        setTasks([...tasks, { name: newTaskName, completed: false }]);
        setNewTaskName("");
        setShowAddTaskForm(false);
    };

    // Toggle task completion
    const toggleTaskCompletion = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
    };

    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="task-progress-page">
            {/* Navbar */}
            {/* <div className="navbar">
                <div className="nav-items">
                    <div className="nav-item"><Link to={`/`} > Home</Link></div>
                    <div className="nav-item">About</div>
                    <div className="nav-item">Contact</div>
                </div>
            </div> */}

            {/* Page Title and Add Task Button */}
            <div className="header">
                <h1>Task Progress</h1>
                <button
                    className="add-task-button"
                    onClick={() => setShowAddTaskForm(true)}
                >
                    Add Task
                </button>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar-container">
                <h3>Overall Progress</h3>
                <div className="progress-bar">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p>
                    {completedTasks} of {totalTasks} tasks completed ({progress}%)
                </p>
            </div>

            {/* Task Table */}
            <div className="task-table-container">
                <h3>Task List</h3>
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Status</th>
                            <th>Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => (
                            <tr key={index}>
                                <td>{task.name}</td>
                                <td>{task.completed ? "Completed" : "In Progress"}</td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTaskCompletion(index)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Task Form */}
            {showAddTaskForm && (
                <div className="add-task-form-container">
                    <h3>Add Task</h3>
                    <input
                        type="text"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        placeholder="Enter task name"
                    />
                    <div className="form-buttons">
                        <button onClick={handleAddTask} className="form-button">
                            Add Task
                        </button>
                        <button
                            onClick={() => setShowAddTaskForm(false)}
                            className="form-button cancel-button"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskProgress;
