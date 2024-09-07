export interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  createdDate: string;
  updatedDate: string;
  status: TaskStatus;
}

export enum TaskStatus {
  OVERDUE = "Overdue",
  DUE_SOON = "Due soon",
  NOT_URGENT = "Not urgent",
}

export enum SortBy {
  DUE_DATE = "due_date",
  CREATED_DATE = "created_date",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}
