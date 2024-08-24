# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN pnpm run build

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["pnpm", "run", "start:prod"]