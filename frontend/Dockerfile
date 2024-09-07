FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose the port for the React app
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
