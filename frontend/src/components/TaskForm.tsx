import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { Task } from "../types/tasks";
import { backendUrl } from "../utils/envUtils";
import "./TaskForm.css";

const TaskForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");

  // If task is provided via location state, use it to prefill form
  useEffect(() => {
    if (location.state?.task) {
      const taskFromState = location.state.task;
      setName(taskFromState.name);
      setDescription(taskFromState.description);
      setDueDate(new Date(taskFromState.dueDate).toISOString().split("T")[0]);
    } else if (id) {
      // Otherwise, fetch task from API
      const fetchTask = async () => {
        try {
          const response = await fetch(`${backendUrl}/tasks/${id}`);
          const data = await response.json();
          setName(data.name);
          setDescription(data.description);
          setDueDate(new Date(data.dueDate).toISOString().split("T")[0]);
        } catch (error) {
          console.error("Failed to load task", error);
        }
      };
      fetchTask();
    }
  }, [id, location.state?.task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !dueDate) {
      alert("Please fill in all fields");
      return;
    }

    const taskData: Partial<Task> = {
      name,
      description,
      dueDate,
    };

    const method = id ? "PATCH" : "POST";
    const url = id ? `${backendUrl}/tasks/${id}` : `${backendUrl}/tasks`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${id ? "update" : "create"} task`);
      }

      navigate("/");
    } catch (error) {
      console.error(`Error ${id ? "updating" : "creating"} task:`, error);
    }
  };

  return (
    <div className="task-form">
      <h2>{id ? "Edit Task" : "Create New Task"}</h2>
      <div>
        <Link to="/" className="back-link">
          Back to Task List
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Task Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-field">
          <label htmlFor="dueDate">Due Date:</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <button type="submit">{id ? "Update Task" : "Create Task"}</button>
      </form>
    </div>
  );
};

export default TaskForm;
