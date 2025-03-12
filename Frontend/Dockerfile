# Use Node.js for building the app
FROM node:20 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the React app
RUN npm run build

# Use Nginx as the base image
FROM nginx:alpine

# Copy the built React app
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]