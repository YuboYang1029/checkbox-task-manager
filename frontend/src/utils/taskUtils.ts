import { differenceInDays } from "date-fns";
import { TaskStatus } from "../types/tasks";

export const getTaskStatus = (dueDate: Date) => {
  const now = new Date();
  const diffDays = differenceInDays(dueDate, now);
  if (diffDays < 0) {
    return TaskStatus.OVERDUE;
  } else if (diffDays <= 7) {
    return TaskStatus.DUE_SOON;
  } else {
    return TaskStatus.NOT_URGENT;
  }
};

export const getStatusClass = (status: TaskStatus | undefined): string => {
  if (status === TaskStatus.OVERDUE) return "overdue";
  if (status === TaskStatus.DUE_SOON) return "due-soon";
  return "not-urgent";
};
