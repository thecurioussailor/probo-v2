# Use Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire codebase
COPY . .

# Build TypeScript code
RUN npm run build

# Command to run the service
CMD ["npm", "start"]
