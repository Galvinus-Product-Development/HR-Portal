# # Use an official Node.js runtime as the base image
# FROM node:20

# # Set the working directory in the container
# WORKDIR /app

# # Copy package.json and package-lock.json first
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm install 

# # Rebuild bcrypt for compatibility (if needed)
# RUN npm rebuild bcrypt --build-from-source

# # Copy the rest of the application code
# COPY . .

# # Ensure Prisma client is generated (if applicable)
# RUN npm run prisma:generate || echo "Skipping Prisma generation"
# # Expose the port the backend uses
# EXPOSE 5000

# # Set environment variables (optional but good practice)
# ENV NODE_ENV=production

# # Start the application
# CMD ["npm", "start"]


# Use a smaller Node.js base image
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Ensure logs directory exists
RUN mkdir -p /app/logs

# Generate Prisma client (if applicable)
RUN npx prisma generate --schema=models/prisma/schema.prisma || echo "Skipping Prisma generation"

# Run Prisma migration (optional)
RUN npx prisma db push --schema=models/prisma/schema.prisma || echo "Skipping Prisma push"

# Remove unnecessary files
RUN rm -rf node_modules/.cache

# Use a minimal runtime image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app /app

# Ensure logs directory exists inside the container
RUN mkdir -p /app/logs && chmod -R 777 /app/logs

# Expose the port
EXPOSE 5000

# Set environment variables
# ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
