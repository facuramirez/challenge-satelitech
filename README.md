# Challenge Técnico - Satelitech

Este proyecto fue desarrollado como parte de un **challenge técnico** solicitado para el proceso de selección de **Satelitech**.

## 🚀 Tecnologías utilizadas

Se utilizaron las tecnologías requeridas por la consigna:

- **Frontend:** React + TailwindCSS  
- **Backend:** Node.js + Express  
- **Base de datos:** MongoDB  
- **Autenticación:** JWT  
- **Infraestructura:** Docker (incluyendo la base de datos)

---

## ✅ Funcionalidades implementadas

Durante el desarrollo se tuvo especial atención en cumplir todos los requisitos mínimos establecidos:

- 🔐 **Login con email y contraseña**
- 🔑 **Implementación de autenticación con JWT**
- 🛡️ **Protección de rutas privadas**
- 📋 **CRUD completo de viajes**
- ✅ **Validación de viajes**:
  - No se permiten registros con más de **30.000 litros**
  - No se permiten fechas de viaje en el **pasado**

---

## 📊 Dashboard principal

El sistema cuenta con una **interfaz clara y funcional** donde se puede:

- Visualizar la **tabla de viajes**
- Utilizar **filtros** personalizados
- Agregar, editar y eliminar viajes mediante botones integrados
- Visualizar una sección de **Estadísticas**, con **gráficos resumen** que facilitan la comprensión de los datos registrados

---

## 💾 Persistencia de datos

Gracias al uso de **volúmenes en Docker**, los datos permanecerán persistentes incluso si la aplicación se detiene.

---

## 🧠 Herramientas utilizadas

Durante el desarrollo se aprovechó la potencia de **Cursor IDE**, lo cual permitió una experiencia de trabajo altamente eficiente, clara y fluida.

---

## 🛠️ Instrucciones para ejecutar el proyecto

1. **Clonar este repositorio**
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   ```

2. **Asegurarse de tener instalado Docker**  
   Puedes descargarlo desde: https://www.docker.com/products/docker-desktop/

3. **Abrir una terminal** y situarse en la carpeta raíz del proyecto (ej: `challenge`)
   ```bash
   cd challenge
   ```

4. **Levantar los contenedores con Docker**
   ```bash
   docker compose up -d
   ```

5. **Acceder a la aplicación** desde el navegador en:  
   👉 [http://localhost:3000](http://localhost:3000)

6. **Para detener la aplicación**
   ```bash
   docker compose down
   ```

---

## 👨‍💻 Autor

**Facundo Ramírez**  
*Desarrollador Full Stack*