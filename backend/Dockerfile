FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Create uploads directory
RUN mkdir -p uploads

# Create scripts directory for seed script
RUN mkdir -p scripts

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "dist/server.js"]
