import { FastifyRequest, FastifyReply } from "fastify";
import { TaskRepository } from "../repositories/taskRepository";
import {
  FetchTasksOptions,
  SortBy,
  SortOrder,
  Task,
  TaskBase,
} from "../types/tasks";

export const MAX_TASKS_PER_PAGE = 5;

export class TaskController {
  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(
    request: FastifyRequest<{ Body: TaskBase }>,
    reply: FastifyReply
  ) {
    try {
      const { name, description, dueDate } = request.body;
      const task = await this.taskRepository.createTask(
        name,
        description,
        dueDate
      );
      reply.status(201).send(task);
    } catch (error) {
      reply.status(500).send({
        message: `Failed to create task - ${(error as Error).message}`,
      });
    }
  }

  async getTasksWithPagination(
    request: FastifyRequest<{
      Querystring: Partial<FetchTasksOptions>;
    }>,
    reply: FastifyReply
  ) {
    try {
      const {
        page = 1,
        limit = MAX_TASKS_PER_PAGE,
        sortBy = SortBy.CREATED_DATE,
        sortOrder = SortOrder.DESC,
        search = "",
      } = request.query;
      const tasks = await this.taskRepository.getTasksWithPagination({
        page,
        limit,
        sortBy,
        sortOrder,
        search,
      });
      reply.send(tasks);
    } catch (error) {
      reply.status(500).send({
        message: `Failed to fetch tasks - ${(error as Error).message}`,
      });
    }
  }

  async getTaskById(
    request: FastifyRequest<{ Params: { id: number } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const task = await this.taskRepository.getTaskById(id);
      if (!task) {
        return reply.status(404).send({
          message: `No task found with ID ${id}. Please check the ID and try again.`,
        });
      }
      reply.send(task);
    } catch (error) {
      reply.status(500).send({
        message: `Failed to fetch task ${request.params.id} - ${(error as Error).message}`,
      });
    }
  }

  async updateTask(
    request: FastifyRequest<{ Params: { id: number }; Body: Partial<Task> }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const updatedFields = request.body;
      const task = await this.taskRepository.updateTask({
        id,
        ...updatedFields,
      });
      if (!task) {
        return reply.status(404).send({
          message: `No task found with ID ${id}. Please check the ID and try again.`,
        });
      }
      reply.send(task);
    } catch (error) {
      reply.status(500).send({
        message: `Failed to update task ${request.params.id} - ${(error as Error).message}`,
      });
    }
  }
}
