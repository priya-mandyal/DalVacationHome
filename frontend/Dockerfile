# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:18-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a smaller base image for serving the static files
FROM nginx:stable-alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the new port (e.g., 5000)
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
