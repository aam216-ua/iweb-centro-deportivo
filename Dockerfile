# Compilar el Frontend
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

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
