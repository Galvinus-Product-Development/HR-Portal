# # Use Node.js LTS as the base image
# FROM node:18-alpine

# # Set working directory inside the container
# WORKDIR /app

# # Copy package.json and package-lock.json first (for better caching)
# COPY package*.json ./

# # Install dependencies
# RUN npm install --only=production

# # Copy the entire source code
# COPY . .

# # Expose the port your Express server runs on
# EXPOSE 5002

# # Define environment variables (optional, can also use Docker Compose)
# ENV NODE_ENV=production

# # Start the application
# CMD ["node", "app.js"]






# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies (only production dependencies)
RUN npm install --omit=dev

# Rebuild bcrypt for compatibility
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Ensure Prisma client is generated (if schema exists)
RUN if [ -f "prisma/schema.prisma" ]; then npm run prisma:generate; fi

# Expose the port the backend uses
EXPOSE 5002

# Allow switching between development and production mode
CMD ["npm", "start"]
