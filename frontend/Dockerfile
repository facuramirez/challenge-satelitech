# Etapa 1: builder
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Copio lockfiles y package.json para cachear deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 2. Copio el resto y construyo la app
COPY . .
RUN yarn build

# Etapa 2: preview con Vite
FROM node:20-alpine

WORKDIR /app

# 3. Copio sólo lo necesario para preview (incluye vite en devDependencies)
COPY package.json yarn.lock ./

# 4. Instalo todas las deps (sin --production, para que vite esté disponible)
RUN yarn install --frozen-lockfile

# 5. Copio el build estático
COPY --from=builder /app/dist ./dist

# 6. Exponer puerto que usa vite preview
EXPOSE 4173

# 7. Arrancar vite preview
CMD ["yarn", "preview", "--host", "0.0.0.0", "--port", "4173"]
