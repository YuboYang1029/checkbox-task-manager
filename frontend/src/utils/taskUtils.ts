import { TaskStatus } from "../types/tasks";

export const getStatusClass = (status: TaskStatus | undefined): string => {
  if (status === TaskStatus.OVERDUE) return "overdue";
  if (status === TaskStatus.DUE_SOON) return "due-soon";
  return "not-urgent";
};
