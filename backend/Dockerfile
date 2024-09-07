FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# Install development tools
RUN npm install -g nodemon ts-node-dev

COPY . .

# Expose the port
EXPOSE 8080

# Use nodemon and ts-node-dev for development
CMD ["nodemon", "--watch", "src", "--exec", "ts-node-dev", "--respawn", "src/index.ts"]
