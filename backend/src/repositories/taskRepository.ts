import { PostgresDb } from "@fastify/postgres";
import { getTaskStatus } from "../utils/statusUtils";
import { FetchTasksOptions, Task } from "../types/tasks";

export class TaskRepository {
  constructor(private readonly pg: PostgresDb) {}

  async createTask(name: string, description: string, dueDate: Date) {
    const status = getTaskStatus(dueDate);
    const result = await this.pg.query(
      "INSERT INTO tasks (name, description, due_date, created_date, updated_date, status) VALUES ($1, $2, $3, NOW(), NOW(), $4) RETURNING *",
      [name, description, dueDate, status]
    );
    return result.rows[0];
  }

  async getTasksWithPagination(fetchOptions: FetchTasksOptions) {
    const { page, limit, sortBy, sortOrder, search } = fetchOptions;
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM tasks`;
    const queryParams: any[] = [];

    // only filter the results with name when the search term is provided
    if (search.trim()) {
      query += ` WHERE name ILIKE $1`;
      queryParams.push(`%${search}%`);
    }

    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const tasksResult = await this.pg.query(query, queryParams);
    return tasksResult.rows;
  }

  async getTaskById(id: number) {
    const result = await this.pg.query("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  async updateTask(updatedFields: Partial<Task>) {
    const { name, description, dueDate, id } = updatedFields;
    const result = await this.pg.query(
      "UPDATE tasks SET name = COALESCE($1, name), description = COALESCE($2, description), due_date = COALESCE($3, due_date) WHERE id = $4 RETURNING *",
      [name, description, dueDate, id]
    );
    return result.rows[0];
  }
}
