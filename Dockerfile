# Use the official Node.js image as a base
FROM node:18

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code to the container image
COPY . .

# Expose the ports the app runs on
EXPOSE 25
EXPOSE 587
EXPOSE 465
EXPOSE 3000

# Run the application
CMD [ "node", "server.js" ]
