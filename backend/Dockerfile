# Use official Node.js LTS Alpine image (smaller and more secure)
FROM node:18-alpine

# Install Python and C++ compiler for code execution
RUN apk add --no-cache python3 g++ make

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies only (no devDependencies in production)
RUN npm ci --only=production

# Copy the rest of the application files
COPY . .

# Create temp directory for code execution
RUN mkdir -p /app/temp && chmod 755 /app/temp

# Expose the backend port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the backend server
CMD ["node", "src/index.js"]