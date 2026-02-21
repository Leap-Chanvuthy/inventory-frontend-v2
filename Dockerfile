# ============================================================
# Stage 1: Build — compile the React / Vite application
# ============================================================
FROM node:20-alpine AS builder

LABEL stage="builder"

WORKDIR /app

# Declare build-time env vars (Vite requires VITE_* to be available during `npm run build`)
ARG VITE_API_URL
ARG VITE_BASE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL

# Install dependencies first (layer-cached unless package files change)
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copy source and build
COPY . .
RUN npm run build

# ============================================================
# Stage 2: Production — serve with Nginx
# ============================================================
FROM nginx:1.27-alpine AS production

LABEL maintainer="GIZ IMS Team" \
      version="2.0" \
      description="Inventory v2 Frontend — production image"

# Remove default Nginx virtual-host config
RUN rm /etc/nginx/conf.d/default.conf

# Copy compiled assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy production Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Validate Nginx config before the image is finalised
RUN nginx -t

EXPOSE 80

# Lightweight health-check: Nginx responds on /
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget -qO /dev/null http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
