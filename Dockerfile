# Use Node LTS
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build (if using TypeScript / NestJS)
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["node", "dist/main.js"]

