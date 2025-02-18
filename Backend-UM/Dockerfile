# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt for compatibility
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Ensure Prisma client is generated (if applicable)
RUN npm run prisma:generate || echo "Skipping Prisma generation"

# Expose the port the backend uses
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
