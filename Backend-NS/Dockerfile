# Use a smaller Node.js base image
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Install OpenSSL explicitly (fix Prisma issue)
RUN apk add --no-cache openssl

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies for Prisma)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Generate Prisma client (if applicable)
RUN npx prisma generate || echo "Skipping Prisma generation"

# Run Prisma migration (optional)
RUN npx prisma migrate deploy || echo "Skipping Prisma migration"

# Use a minimal runtime image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Install OpenSSL explicitly in runtime image
RUN apk add --no-cache openssl

# Copy only necessary files from the build stage
COPY --from=build /app /app

# Expose the port
EXPOSE 5002

# Set environment variables
ENV PORT=5002

# Start the application
CMD ["node", "app.js"]
