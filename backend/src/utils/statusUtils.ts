import { TaskStatus } from "../types/tasks";
import { differenceInDays } from "date-fns";

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
