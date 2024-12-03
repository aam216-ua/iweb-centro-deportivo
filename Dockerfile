# Compilar el Frontend
FROM oven/bun:latest AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lockb ./
RUN bun install
COPY frontend/ .
RUN bun run build

# Compilar el Backend
FROM node:20-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN yarn install
COPY backend/ .
RUN yarn run build

# Servir la aplicación
FROM node:20-alpine
WORKDIR /app

COPY --from=frontend /app/frontend/dist /app/public
COPY --from=backend /app/backend/dist ./dist
COPY --from=backend /app/backend/node_modules ./node_modules
COPY --from=backend /app/backend/package*.json ./

EXPOSE 3000
CMD ["node", "dist/main"]
