# ========================================
# Stage 1: Build the React application (Vite)
# ========================================
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Vite application
# API URLs are hardcoded in your source code
RUN npm run build

# ========================================
# Stage 2: Serve with Nginx
# ========================================
FROM nginx:alpine

# Copy built files from build stage
# Vite outputs to 'dist' folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration (for React Router support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]