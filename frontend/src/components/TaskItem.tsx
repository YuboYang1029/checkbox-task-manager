import React from "react";
import { Task } from "../types/tasks";
import { getStatusClass } from "../utils/taskUtils";
import "./TaskItem.css";

interface TaskItemProps {
  task: Task;
  expandedTaskId: number | null;
  onToggleDescription: (taskId?: number) => void;
  onEditTask: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  expandedTaskId,
  onToggleDescription,
  onEditTask,
}) => {
  return (
    <li className="task-item">
      <div>
        <strong>Name:</strong> {task.name}
      </div>
      <div>
        <strong>Created Date:</strong>{" "}
        {new Date(task.createdDate).toLocaleDateString()}
      </div>
      <div>
        <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
      </div>
      <div>
        <strong>Status:</strong>{" "}
        <span className={`status ${getStatusClass(task.status)}`}>
          {task.status}
        </span>
      </div>
      <div>
        <button onClick={() => onToggleDescription(task.id)}>
          {expandedTaskId === task.id ? "Hide Description" : "Show Description"}
        </button>

        {expandedTaskId === task.id && (
          <div className="task-description">
            <strong>Description:</strong>
            <p>{task.description}</p>
          </div>
        )}
      </div>

      <button onClick={() => onEditTask(task)}>Edit</button>
    </li>
  );
};

export default TaskItem;
