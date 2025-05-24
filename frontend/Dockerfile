# Etapa 1: build de la aplicación con Yarn
FROM node:20-alpine AS builder

WORKDIR /app

# Limpiar el caché de yarn
RUN yarn cache clean

# Copiar solo los archivos necesarios para instalar dependencias
COPY package.json yarn.lock ./

# Instalar dependencias
RUN yarn install --frozen-lockfile

# Copiar el resto del proyecto
COPY . .

# Construir la aplicación
RUN yarn build

# Etapa 2: servir archivos estáticos con nginx
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar el build de Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Ejecutar Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
