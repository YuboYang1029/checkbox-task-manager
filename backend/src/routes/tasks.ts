import { FastifyInstance } from "fastify";
import { TaskRepository } from "../repositories/taskRepository";
import { TaskController } from "../controllers/taskController";

export async function taskRoutes(fastify: FastifyInstance) {
  const taskRepository = new TaskRepository(fastify.pg);
  const taskController = new TaskController(taskRepository);

  fastify.post("/tasks", taskController.createTask.bind(taskController));
  fastify.get(
    "/tasks",
    taskController.getTasksWithPagination.bind(taskController)
  );
  fastify.get("/tasks/:id", taskController.getTaskById.bind(taskController));
  fastify.patch("/tasks/:id", taskController.updateTask.bind(taskController));
}
