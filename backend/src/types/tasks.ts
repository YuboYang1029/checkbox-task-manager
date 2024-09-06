export interface TaskBase {
  name: string;
  description: string;
  dueDate: Date;
}
export interface Task extends TaskBase {
  id: number;
  createdDate?: Date;
  updatedDate?: Date;
  status?: string;
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

export interface FetchTasksOptions {
  page: number;
  limit: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  search: string;
}
