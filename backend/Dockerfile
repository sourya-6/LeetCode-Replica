# Use official Node.js LTS image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install uuid


# Copy the rest of the application files
COPY . .

# Expose the backend port
EXPOSE 3000

# Start the backend server (pointing to src/index.js)
CMD ["node", "src/index.js"]