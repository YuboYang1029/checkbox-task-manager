import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SortBy, SortOrder, Task } from "../types/tasks";
import TaskItem from "./TaskItem";
import { backendUrl, pageSize } from "../utils/envUtils";
import "./TaskList.css";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [sortField, setSortField] = useState<SortBy>(SortBy.CREATED_DATE);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const navigate = useNavigate();

  // Fetch paginated tasks from the backend API
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const url = `${backendUrl}/tasks?page=${page}&limit=${pageSize}&sortBy=${sortField}&sortOrder=${sortOrder}&search=${searchQuery}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        console.log({ data });
        setTasks(data.tasks);
        setTotalPages(data.meta.totalPages);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page, sortField, sortOrder, searchQuery]);

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

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(e.target.value as SortBy);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as SortOrder);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setPage(1);
  };

  return (
    <div className="task-manager">
      <h1>Task Manager</h1>

      <button onClick={handleCreateTask}>Create New Task</button>

      <div className="sorting-controls">
        <label htmlFor="sortField">Sort by:</label>
        <select id="sortField" value={sortField} onChange={handleSortByChange}>
          <option value={SortBy.CREATED_DATE}>Created Date</option>
          <option value={SortBy.DUE_DATE}>Due Date</option>
        </select>

        <label htmlFor="sortOrder">Order:</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortOrderChange}
        >
          <option value={SortOrder.ASC}>Ascending</option>
          <option value={SortOrder.DESC}>Descending</option>
        </select>
      </div>

      <div className="search-controls">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchInputChange}
          placeholder="Search tasks..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          {tasks.length === 0 ? (
            <div className="empty-message">
              No tasks available. You can start by creating your first task, or
              try refining your search to find matching tasks.
            </div>
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
        </>
      )}
    </div>
  );
};

export default TaskList;
