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

# Ensure Prisma client is generated (Only if schema.prisma exists)
RUN if [ -f "prisma/schema.prisma" ]; then npm run prisma:generate; else echo "Skipping Prisma generation"; fi

# Expose the port the backend uses
EXPOSE 5002

# Start the application
CMD ["npm", "start"]
