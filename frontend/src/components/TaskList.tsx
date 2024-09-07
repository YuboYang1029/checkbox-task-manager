import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Task } from "../types/tasks";
import TaskItem from "./TaskItem";
import { backendUrl, pageSize } from "../utils/envUtils";
import "./TaskList.css";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const navigate = useNavigate();

  // Fetch paginated tasks from the backend API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${backendUrl}/tasks?page=${page}&limit=${pageSize}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data.tasks);
        setTotalPages(data.meta.totalPages);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleCreateTask = () => {
    navigate("/create-task"); // Navigate to the create task route
  };

  const handleEditTask = (task: Task) => {
    navigate(`/edit-task/${task.id}`, { state: { task } });
  };

  const toggleDescription = (taskId?: number) => {
    if (taskId) {
      setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
    }
  };

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>

      <button onClick={handleCreateTask}>Create New Task</button>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                expandedTaskId={expandedTaskId}
                onToggleDescription={toggleDescription}
                onEditTask={handleEditTask}
              />
            ))}
          </ul>

          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskList;
