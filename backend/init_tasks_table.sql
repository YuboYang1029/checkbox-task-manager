DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tasks') THEN
        CREATE TABLE tasks (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            due_date DATE NOT NULL,
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(50) CHECK (status IN ('Not urgent', 'Due soon', 'Overdue')) NOT NULL
        );
    END IF;
END $$;