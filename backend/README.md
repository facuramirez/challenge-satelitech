# Backend de Gestión de Viajes

Este es un backend desarrollado con Node.js, Express y TypeScript para la gestión de viajes.

## Requisitos Previos

- Node.js (v14 o superior)
- MongoDB
- Yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd viajes-backend
```

2. Instalar dependencias:
```bash
yarn install
```

3. Crear archivo .env en la raíz del proyecto con las siguientes variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/viajes_db
JWT_SECRET=tu_secreto_super_seguro
JWT_REFRESH_SECRET=tu_refresh_secreto_super_seguro
COOKIE_SECRET=tu_cookie_secreto_super_seguro
```

## Desarrollo

Para ejecutar el servidor en modo desarrollo:
```bash
yarn dev
```

## Producción

Para compilar y ejecutar en producción:
```bash
yarn build
yarn start
```

## Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión (requiere autenticación)

### Viajes
- `GET /viajes` - Obtener todos los viajes activos (requiere autenticación)
- `POST /viajes` - Crear un nuevo viaje (requiere autenticación)
- `PUT /viajes/:id` - Actualizar un viaje existente (requiere autenticación)
- `DELETE /viajes/:id` - Cancelar un viaje (requiere autenticación)

## Seguridad

- Autenticación mediante JWT con refresh tokens
- Cookies httpOnly para almacenar tokens
- Contraseñas hasheadas con bcrypt 