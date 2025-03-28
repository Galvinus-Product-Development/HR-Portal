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

# Generate Prisma client
RUN npx prisma generate || echo "Skipping Prisma generation"

# Run Prisma migration (optional)
RUN npx prisma db push || echo "Skipping Prisma push"

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

# Expose the application port
EXPOSE 5003

# Set environment variables (Uncomment if needed)
# ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
