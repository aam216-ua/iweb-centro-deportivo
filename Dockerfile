# Compilar el Frontend
FROM node:22-alpine AS frontend
WORKDIR /app
COPY frontend/package*.json .
RUN npm install
COPY frontend/ .
RUN npm run build

# Compilar el Backend
FROM node:22-alpine AS backend
WORKDIR /app
COPY backend/package.json .
COPY backend/yarn.lock .
RUN yarn install
COPY backend/ .
RUN yarn build

# Servir la aplicación
FROM node:22-alpine
WORKDIR /app
COPY --from=backend /app/node_modules ./node_modules
COPY --from=backend /app/dist ./dist
COPY --from=frontend /app/dist ./dist/public
EXPOSE 3000
CMD ["node", "dist/main"]
