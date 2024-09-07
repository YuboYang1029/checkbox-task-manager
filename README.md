# Checkbox Task Manager

This project delivers a task management application based on the customer interviews and user mapping flows. The task manager allows users to create, edit, view, sort and search tasks efficiently. The system is designed to scale efficiently, allowing it to handle a large number of tasks without compromising performance.

<br>

## Features

### Implemented User Stories:
- **Task Creation**: Users can create tasks by providing a name, description, and due date.
- **Task List View**: Displays all created tasks with the required details.
- **Task Editing**: Users can edit task details (name, description, and due date).
- **Task Status Calculation**: The task's status is determined based on the due date.
- **Task Sorting**: Tasks can be sorted by:
  - Created date (asce/desc)
  - Due date (asce/desc)
- **Task Search**: Users can search tasks based on their name, providing a customised way to filter tasks.

<br>

## Running the Project

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YuboYang1029/checkbox-task-manager.git
   cd checkbox-task-manager
   ```

2. **Docker Setup**: Ensure Docker is installed on your machine.
   - Run the following command to build the Docker images and start the **frontend**, **backend**, and **database** containers:
   ```bash
   npm run docker:build
   ```
   - Note: `npm run docker:build` is typically run only the first time or when you need to rebuild the Docker images. For subsequent runs, you can simply use:
   ```bash
   npm run docker:up
   ```

3. **Access the Application**:
   - You can start to visit the React App: `http://localhost:3000`
   - The backend (Fastify API server) is also available: `http://localhost:8080`

4. **Access the pgAdmin**:
   - you can visit `http://localhost:5050/browser/` to manage the Postgres database. Login creds can be found at `docker-compose.yml`. Database Server Connection details as follows:
     - Host: `db`
     - Port: `5432`
     - db: `task-db`
     - Username: `postgres`
     - Password: `password`

   
6. **Shut Down**: To stop and remove all running containers, use the following command:
   ```bash
   npm run docker:down
   ```

<br>

## Installing Dependencies Locally (without Docker)

Although the application is fully containerized for easy setup, you may want to install dependencies locally for code review purposes. This helps avoid issues like red-highlighted errors in your IDE when there is no local `node_modules` folder.

1. Install dependencies in both the `frontend` and `backend` directories:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

<br>

## Technology Stack

- **Frontend**: React, TypeScript
- **Backend**: Fastify, TypeScript, Postgres
- **Database**: Postgres
- **Containerization**: Docker

<br>

## Design Decisions

### Backend (NodeJS + Fastify + TypeScript + Postgres + Docker):
- **Fastify** was chosen for its performance advantages, particularly given the requirement to handle large volumes of tasks efficiently. It follows a layered architecture that includes routes, controllers, and repositories to ensure a clear separation of concerns:
  - **Routes**: Handle incoming API requests and route them to the appropriate controllers.
  - **Controllers**: Contain the business logic, processing the requests and interacting with the repositories to fetch or update data.
  - **Repositories**: Handle direct interaction with the database (Postgres), running SQL queries and returning data to the controllers.
- The backend uses **Postgres** for task storage and supports below features:
  - Pagination: To handle large datasets and avoid loading all tasks at once.
  - Sorting and Searching: Implemented using query parameters to customise the task rows fetching options.
- **Docker** is used to containerize the entire application, simplifying dependency management and ensuring a consistent environment across different systems. During the Docker setup, the task table is automatically initialized in the Postgres database, streamlining the development and deployment process without the need for manual database setup.
- **pgAdmin** is also included in the setup to help manage and inspect the pg database more effectively.


### Frontend (React + TypeScript + Docker):
- The frontend was built using **React** and **TypeScript**, ensuring type safety and scalable architecture.
- Component **TaskForm** handles both task creation and editing in a reusable component, with form validation to ensure data integrity.
- Component **TaskList** manages task listing, sorting, searching, and pagination, ensuring the UI can handle large datasets without compromising user experience.
- Component **TaskItem** displays individual task details, with dynamic styling to indicate task status (Not urgent, Due soon, Overdue).

<br>

## Approach to the "Should Have" Features (Sorting and Search)

**Default Sorting (Created Date - Descending)**:

- When the application loads, tasks are sorted by the created date in descending order by default, ensuring that the newly created tasks are always shown at the top.
- The user can update the sorting options (e.g., by due date, ascending/descending), which will re-trigger the tasks fetch from the backend.
- Sorting is handled via query parameters in the API request, and the backend dynamically adjusts the PostgreSQL query to return tasks in the specified order.

**Default Search Term (Empty String)**:

- By default, the search term is set to an empty string, meaning no search filter is applied when loading the task list initially.
- The backend ignores the name ILIKE clause in the SQL query when the search term is an empty string.
- If a valid search term is provided by the user, the backend adds the name ILIKE clause to filter tasks based on the provided term, ensuring efficient querying by only applying the search when necessary.

<br>

## Risk and Scalability Considerations

To address the risk of handling 10s of 1000s of tasks, the following optimizations can be made (Pagination is already implmented):
- **Pagination**: Only a configured limited number of tasks are loaded per page per request, reducing the load on the backend and frontend.
- **Task Status Data Integrity**: One of the key concerns is ensuring data integrity for task status, as the status is dynamically calculated based on the difference between the current date and the task’s due date. The status (Not Urgent, Due Soon, Overdue) will change over time, making it necessary to recheck and update these statuses periodically. If we calculate the status dynamically on fetch for every request, this could lead to performance issues, especially when handling large datasets or when returning all tasks in a single request.
  - **Proposed Solution: Scheduled Updates**: We can set up a scheduled job (e.g., a cron job or background task) to check and update task statuses on a regular basis (e.g., daily). This can be done using a database trigger or a dedicated service that updates the status column based on the current date and the task's due date.

<br>

## Future Improvements

1. **Add Test Suites**:  
   Implement comprehensive test coverage, including:
   - **Unit tests** for both frontend and backend.
   - **Integration tests** to ensure that different components work together as expected.
   - **End-to-end (E2E) tests** to verify the complete user flow from the frontend to the backend.

2. **Authentication Middleware**:  
   Implement authentication middleware to protect routes such as task creation and editing, ensuring only authorized users can perform these actions.

3. **Restrict Due Date**:  
   Add validation to restrict task creation, ensuring that the **due date cannot be set in the past**.

4. **Task Edit Restriction**:  
   Disable the task submission button on the edit form if no fields have been changed, preventing unnecessary updates.

5. **Optimize Database Queries**:  
   Ensure that the columns used for sorting and searching (e.g., `due_date`, `created_date`, `name`) are **indexed**. This will significantly improve query performance, especially for large datasets.


<br>

## Personal Notes

- **Git Workflow**:  
  I followed a structured Git workflow by creating a **feature branch** and submitting a **pull request (PR)** to showcase the process. I also adhered to the **conventional commit message format** for clarity and consistency in the commit history.

- **Git Username Issue**:  
  Initially, my default local Git username didn't match my GitHub account, causing commits to appear as if they had a co-author (Yubo Yang + YuboYang1029). After running the following command:

  ```bash
  git config --global user.name "YuboYang1029"
  ```
  the issue was resolved, and all subsequent commits reflect the correct username.
