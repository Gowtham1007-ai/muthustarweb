# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build (if using TypeScript)
RUN npm run build

# Expose backend port
EXPOSE 5000

# Start backend
CMD ["npm", "run", "start"]
