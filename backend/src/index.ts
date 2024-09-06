import Fastify from "fastify";
import fastifyPostgres from "@fastify/postgres";
import fastifyCors from "@fastify/cors";
import * as dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({ logger: true });
fastify.register(fastifyCors);

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
} = process.env;

const connectionString = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
fastify.register(fastifyPostgres, {
  connectionString,
});

// Test function to check the database connection on startup, will be removed later.
const checkDbConnection = async () => {
  try {
    const client = await fastify.pg.connect();
    await client.query("SELECT 1");
    client.release();
    fastify.log.info("Database connected successfully");
  } catch (err) {
    fastify.log.error("Failed to connect to the database", err);
    process.exit(1);
  }
};

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info(`Task Manager Server running at http://localhost:3000/`);
    await checkDbConnection();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
