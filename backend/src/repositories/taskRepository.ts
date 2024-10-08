import { PostgresDb } from "@fastify/postgres";
import { getTaskStatus, mapTaskToCamelCase } from "../utils/taskUtils";
import { FetchTasksOptions, Task } from "../types/tasks";

export class TaskRepository {
  constructor(private readonly pg: PostgresDb) {}

  async createTask(name: string, description: string, dueDate: Date) {
    const status = getTaskStatus(dueDate);
    const result = await this.pg.query(
      "INSERT INTO tasks (name, description, due_date, created_date, updated_date, status) VALUES ($1, $2, $3, NOW(), NOW(), $4) RETURNING *",
      [name, description, dueDate, status]
    );
    return mapTaskToCamelCase(result.rows[0]);
  }

  async getTasksWithPagination(fetchOptions: FetchTasksOptions) {
    const { page, limit, sortBy, sortOrder, search } = fetchOptions;
    const offset = (page - 1) * limit;

    let tasksQuery = "SELECT * FROM tasks";
    let countQuery = "SELECT COUNT(*) FROM tasks";
    const tasksParams: any[] = [];
    const countParams: any[] = [];

    // only add the name search filter, when the valid search term is provided
    if (search.trim()) {
      const searchNameClause = ` WHERE name ILIKE $1`;
      tasksQuery += searchNameClause;
      countQuery += searchNameClause;
      tasksParams.push(`%${search}%`);
      countParams.push(`%${search}%`);
    }

    tasksQuery += ` ORDER BY ${sortBy} ${sortOrder}`;
    tasksQuery += ` LIMIT $${tasksParams.length + 1} OFFSET $${tasksParams.length + 2}`;
    tasksParams.push(limit, offset);

    const [tasksResult, countResult] = await Promise.all([
      this.pg.query(tasksQuery, tasksParams),
      this.pg.query(countQuery, countParams),
    ]);

    const totalTasks = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalTasks / limit);

    return {
      tasks: tasksResult.rows.map(mapTaskToCamelCase),
      meta: {
        totalTasks,
        totalPages,
      },
    };
  }

  async getTaskById(id: number) {
    const result = await this.pg.query("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);
    return mapTaskToCamelCase(result.rows[0]);
  }

  async updateTask(updatedFields: Partial<Task>) {
    const { name, description, dueDate, id } = updatedFields;
    // Recalculate the status only when the due date has been updated
    const status = dueDate ? getTaskStatus(dueDate) : null;

    const result = await this.pg.query(
      "UPDATE tasks SET name = COALESCE($1, name), description = COALESCE($2, description), due_date = COALESCE($3, due_date), status = COALESCE($4, status) WHERE id = $5 RETURNING *",
      [name, description, dueDate, status, id]
    );
    return mapTaskToCamelCase(result.rows[0]);
  }
}
