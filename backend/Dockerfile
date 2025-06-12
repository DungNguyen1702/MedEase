# backend/Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

# Copy and install deps
COPY package*.json ./
# COPY .env .env
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build the app (nếu dùng TypeScript)
RUN npm run build

# Expose port (NestJS thường dùng 3000)
EXPOSE 8000

# Run the app
CMD ["npm", "run", "start"]