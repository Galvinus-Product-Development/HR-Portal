# Use a minimal Node.js image for build stage
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Ensure Prisma client is generated (if schema.prisma exists)
RUN if [ -f "prisma/schema.prisma" ]; then npm run prisma:generate; else echo "Skipping Prisma generation"; fi

# Rebuild bcrypt for Alpine compatibility (if used)
RUN npm rebuild bcrypt --build-from-source || echo "Skipping bcrypt rebuild"

# Remove cache and unnecessary files
RUN rm -rf node_modules/.cache

# Use a minimal Node.js runtime for the final stage
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app /app

# Ensure correct permissions
RUN chmod -R 777 /app

# Expose the port
EXPOSE 5001

# Start the application
CMD ["npm", "start"]
