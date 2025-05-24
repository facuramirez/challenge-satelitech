# Challenge Técnico - Satelitech

Este proyecto fue desarrollado como parte de un **challenge técnico** solicitado para el proceso de selección de **Satelitech**.

### 🚀 Tecnologías utilizadas

Se utilizaron las tecnologías requeridas por la consigna:

- **Frontend:** React + TailwindCSS
- **Backend:** Node.js + Express
- **Base de datos:** MongoDB
- **Autenticación:** JWT
- **Infraestructura:** Docker (incluyendo la base de datos)

---

### ✅ Funcionalidades implementadas

Durante el desarrollo se tuvo especial atención en cumplir todos los requisitos mínimos establecidos:

- 🔐 **Login con email y contraseña**
- 🔑 **Implementación de autenticación con JWT**
- 🛡️ **Protección de rutas privadas**
- 📋 **CRUD completo de viajes**
- ✅ **Validación de viajes**:
  - No se permiten registros con más de **30.000 litros**
  - No se permiten fechas de viaje en el **pasado**

---

### 📊 Dashboard principal

El sistema cuenta con una **interfaz clara y funcional** donde se puede:

- Visualizar la **tabla de viajes**
- Utilizar **filtros** personalizados
- Agregar, editar y eliminar viajes mediante botones integrados
- Visualizar una sección de **Estadísticas**, con **gráficos resumen** que facilitan la comprensión de los datos registrados

---

### 💾 Persistencia de datos

Gracias al uso de **volúmenes en Docker**, los datos permanecerán persistentes incluso si la aplicación se detiene.

---

### 🛠️ Instrucciones para ejecutar el proyecto

1. **Clonar este repositorio**

   ```bash
   git clone https://github.com/facuramirez/challenge-satelitech
   ```

###

2. **Asegurarse de tener instalado Docker**  
   Puedes descargarlo desde: https://www.docker.com/products/docker-desktop/

###

3. **Abrir una terminal** y situarse en la carpeta raíz del proyecto (`./challenge-satelitech`)

   ```bash
   ./directorio-donde-se-clonó-este-repositorio/challenge-satelitech
   ```

###

4. **Levantar los contenedores con Docker**

   ```bash
   docker compose up -d
   ```

###

5. **Acceder a la aplicación** desde el navegador en:  
   👉 [http://localhost:3000](http://localhost:3000)

###

6. **Para detener la aplicación**

   ```bash
   docker compose down
   ```

###

7. Crear un archivo `.env` en la raíz del proyecto **(dentro de la carpeta challenge a la misma altura del docker-compose.yml)** con el siguiente contenido:

```env
PORT=4000
NODE_ENV=production
MONGODB_URI=mongodb://mongodb:27017/viajes_db
JWT_SECRET=prod-jwt
JWT_REFRESH_SECRET=prod-refresh-jwt
COOKIE_SECRET=prod-cookie-secret
ORIGIN=http://localhost:3000
```

> ⚠️ **Aviso:** Las variables aquí expuestas son de uso exclusivamente académico y fueron incluidas como parte de este challenge técnico.  
> No contienen información sensible real y **no deben utilizarse en entornos productivos**.

---

### 👨‍💻 Autor

**Facundo Ramírez**  
_Desarrollador Full Stack_
