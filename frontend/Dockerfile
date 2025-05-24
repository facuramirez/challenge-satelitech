# Etapa 1: build de la aplicación con Yarn
FROM node:20-alpine AS builder

WORKDIR /app

COPY . .

# Instalar dependencias y construir con Yarn
RUN yarn install
RUN yarn build

# Etapa 2: servir archivos estáticos con nginx
FROM nginx:alpine

# Copiar build a la carpeta pública de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
