# Etapa de construcción
FROM node:18-alpine AS builder

# Crear y establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos de dependencias
COPY package.json yarn.lock ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN yarn install

# Copiar el código fuente y archivos de configuración
COPY . .

# Limpiar la carpeta dist si existe
RUN rm -rf dist || true

# Compilar TypeScript a JavaScript
RUN yarn build

# Verificar que el archivo existe
RUN ls -la dist/app.js || exit 1

# Etapa de producción
FROM node:18-alpine

WORKDIR /usr/src/app

# Copiar package.json y yarn.lock
COPY package.json yarn.lock ./

# Instalar solo las dependencias de producción
RUN yarn install --production --frozen-lockfile

# Copiar el código compilado desde la etapa de builder
COPY --from=builder /usr/src/app/dist ./dist

# Verificar que el archivo existe en producción
RUN ls -la dist/app.js || exit 1

# Exponer el puerto
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["node", "dist/app.js"] 