# Use Node.js LTS version
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./

# Install dependencies with clean install for production
RUN npm ci --only=production

# Create directory for logs
RUN mkdir -p logs && chmod 777 logs

# Copy the rest of the application
COPY . .

# Create a non-root user and switch to it
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 && \
    chown -R nodeuser:nodejs /app

USER nodeuser

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose the API port
EXPOSE 3000

# Start the application
CMD ["node", "src/server.js"]
