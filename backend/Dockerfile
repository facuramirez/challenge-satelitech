# Etapa de construcción
FROM node:18-alpine AS builder

# Crear y establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos de dependencias
COPY package.json yarn.lock ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN yarn install

# Copiar el código fuente y archivos de configuración de TypeScript
COPY tsconfig.json .
COPY src ./src

# Compilar TypeScript a JavaScript
RUN yarn build

# Etapa de producción
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar package.json y yarn.lock
COPY package.json yarn.lock ./

# Instalar solo las dependencias de producción
RUN yarn install --production --frozen-lockfile

# Copiar el código compilado desde la etapa de builder
COPY --from=builder /usr/src/app/dist ./dist

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/app.js"] 