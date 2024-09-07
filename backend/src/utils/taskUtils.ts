import { differenceInDays } from "date-fns";
import { Task, TaskStatus } from "../types/tasks";

export const getTaskStatus = (dueDate: Date) => {
  const now = new Date();
  const diffDays = differenceInDays(dueDate, now);
  if (diffDays < 0) {
    return TaskStatus.OVERDUE;
  } else if (diffDays < 7) {
    return TaskStatus.DUE_SOON;
  } else {
    return TaskStatus.NOT_URGENT;
  }
};

export const mapTaskToCamelCase = (task: Record<string, any>): Task => {
  return {
    id: task.id,
    name: task.name,
    description: task.description,
    dueDate: task.due_date,
    createdDate: task.created_date,
    updatedDate: task.updated_date,
    status: task.status,
  };
};
