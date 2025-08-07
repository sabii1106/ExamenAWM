# 🏟️ Sistema de Reservas de Canchas de Fútbol

Sistema MERN completo para gestionar reservas de los 4 sectores de canchas de fútbol para grupos estudiantiles. Incluye CRUD completo tanto para reservas como para canchas.

## 📁 Estructura del Proyecto

```
ExamenAWM/
├── backend/          # API REST con Express.js + Sequelize + MySQL
│   ├── config/       # Configuración de base de datos
│   ├── models/       # Modelos Sequelize (Cancha, Reserva)
│   ├── routes/       # Rutas API (canchas.js, reservas.js)
│   ├── server.js     # Servidor principal
│   ├── package.json  # Dependencias del backend
│   └── .env          # Variables de entorno
├── frontend/         # React App con interfaz completa
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Comunicación con API
│   │   └── App.js         # Componente principal
│   └── package.json       # Dependencias del frontend
└── README.md         # Este archivo
```

## 🛠️ Requisitos Previos

- **Node.js** (v16 o superior)
- **MySQL Server** (v8.0 o superior)
- **MySQL Workbench** (opcional, para gestión visual)
- **Git** (para clonar el repositorio)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/sabii1106/ExamenAWM.git
cd ExamenAWM
```

### 2. Configurar la Base de Datos
1. Abrir MySQL y crear usuario (si no existe):
```sql
CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

2. El sistema creará automáticamente la base de datos `reservas_canchas`

### 3. Configurar Backend
```bash
cd backend
npm install
```

Verificar archivo `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=reservas_canchas
DB_PORT=3306
PORT=5000
```

### 4. Configurar Frontend
```bash
cd ../frontend
npm install
```

## ▶️ Ejecutar la Aplicación

### Opción 1: Ejecución Manual (Recomendada para desarrollo)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Servidor API disponible en: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Aplicación web disponible en: `http://localhost:3000`

### Opción 2: Ejecución Automática (Con concurrently)
```bash
cd backend
npm run dev
```

## 🎯 Funcionalidades

### 📋 Gestión de Reservas (CRUD Completo)
- ✅ **Crear** reservas con validación de horarios
- ✅ **Leer** reservas por fecha/cancha
- ✅ **Actualizar** reservas existentes
- ✅ **Eliminar** reservas (soft/hard delete)
- ✅ **Verificar disponibilidad** automática
- ✅ **Prevenir conflictos** de horarios

### 🏟️ Gestión de Canchas (CRUD Completo)
- ✅ **Crear** nuevas canchas
- ✅ **Leer** lista de canchas activas
- ✅ **Actualizar** información de canchas
- ✅ **Activar/Desactivar** canchas
- ✅ **Eliminar** canchas (con validaciones)
- ✅ **Estadísticas** de uso

### 🎨 Interfaz de Usuario
- ✅ **Calendario visual** de reservas
- ✅ **Formularios intuitivos** con validación
- ✅ **Gestión completa** mediante modales
- ✅ **Diseño responsive** para móviles
- ✅ **Navegación por pestañas**

## 🗃️ Estructura de Base de Datos

### Tabla: `canchas`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| nombre | VARCHAR(100) | Nombre de la cancha |
| descripcion | TEXT | Descripción opcional |
| capacidad | INT | Número de jugadores |
| activa | BOOLEAN | Estado de la cancha |

### Tabla: `reservas`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT (PK) | Identificador único |
| grupoEstudiantil | VARCHAR(150) | Nombre del grupo |
| contacto | VARCHAR(100) | Persona responsable |
| telefono | VARCHAR(20) | Teléfono de contacto |
| fecha | DATE | Fecha de la reserva |
| horaInicio | TIME | Hora de inicio |
| horaFin | TIME | Hora de finalización |
| canchaId | INT (FK) | Referencia a cancha |
| estado | ENUM | activa/cancelada/completada |
| observaciones | TEXT | Notas adicionales |

## 🔧 API Endpoints

### Canchas
- `GET /api/canchas` - Listar canchas activas
- `GET /api/canchas/:id` - Obtener cancha específica
- `POST /api/canchas` - Crear nueva cancha
- `PUT /api/canchas/:id` - Actualizar cancha
- `PUT /api/canchas/:id/activar` - Activar cancha
- `PUT /api/canchas/:id/desactivar` - Desactivar cancha
- `DELETE /api/canchas/:id` - Eliminar cancha
- `GET /api/canchas/estadisticas/uso` - Estadísticas

### Reservas
- `GET /api/reservas` - Listar todas las reservas
- `GET /api/reservas/:id` - Obtener reserva específica
- `GET /api/reservas/fecha/:fecha` - Reservas por fecha
- `POST /api/reservas` - Crear nueva reserva
- `PUT /api/reservas/:id` - Actualizar reserva
- `PUT /api/reservas/:id/cancelar` - Cancelar reserva
- `DELETE /api/reservas/:id` - Eliminar reserva
- `POST /api/reservas/verificar-disponibilidad` - Verificar horario

## 🧪 Pruebas

### Probar API con curl:
```bash
# Listar canchas
curl http://localhost:5000/api/canchas

# Listar reservas
curl http://localhost:5000/api/reservas

# Crear reserva
curl -X POST http://localhost:5000/api/reservas \
  -H "Content-Type: application/json" \
  -d '{"grupoEstudiantil":"Grupo Test","contacto":"Juan Pérez","fecha":"2024-12-15","horaInicio":"14:00","horaFin":"16:00","canchaId":1}'
```

## 🛠️ Tecnologías Utilizadas

### Backend
- **Express.js** - Framework web
- **Sequelize** - ORM para MySQL
- **MySQL** - Base de datos
- **CORS** - Comunicación cross-origin
- **dotenv** - Variables de entorno

### Frontend
- **React** - Librería de interfaz
- **Axios** - Cliente HTTP
- **CSS3** - Estilos personalizados
- **JavaScript ES6+** - Lógica de aplicación

## 📱 Uso de la Aplicación

1. **Inicializar datos**: Al abrir por primera vez, se crean las 4 canchas automáticamente
2. **Ver calendario**: Visualiza todas las reservas en una vista de calendario
3. **Crear reserva**: Usa el formulario con validación automática de horarios
4. **Gestionar reservas**: Edita o elimina reservas existentes
5. **Gestionar canchas**: Administra las canchas disponibles

## 🐛 Solución de Problemas

### Error de conexión a MySQL:
```bash
# Verificar que MySQL esté corriendo
mysql -u root -p

# Verificar configuración en backend/.env
DB_HOST=localhost
DB_USER=root
DB_PASS=root
```

### Error "Cannot GET /":
- El frontend debe ejecutarse en puerto 3000
- El backend debe ejecutarse en puerto 5000
- Verificar que ambos estén corriendo

### Error de CORS:
- Verificar que el backend tenga configurado CORS
- Verificar URLs en `frontend/src/services/api.js`

## 👥 Contribuir

1. Fork del proyecto
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

- **Desarrollador**: [sabii1106](https://github.com/sabii1106)
- **Proyecto**: [ExamenAWM](https://github.com/sabii1106/ExamenAWM)
- **Tecnologías**: MERN Stack (MySQL + Express + React + Node.js)

## Configuración de Base de Datos

1. Crear base de datos en MySQL:
```sql
CREATE DATABASE reservas_canchas;
```

2. Configurar variables de entorno en `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_contraseña_mysql
DB_NAME=reservas_canchas
DB_PORT=3306
PORT=5000
```

## Instalación y Ejecución

### Backend

```bash
cd backend
npm install
npm run dev
```

El servidor estará disponible en: http://localhost:5000

### Frontend (después que termine la instalación)

```bash
cd frontend
npm install axios react-router-dom
npm start
```

La aplicación estará disponible en: http://localhost:3000

## API Endpoints

### Canchas
- `GET /api/canchas` - Obtener todas las canchas
- `GET /api/canchas/:id` - Obtener cancha específica
- `POST /api/canchas` - Crear nueva cancha

### Reservas
- `GET /api/reservas` - Obtener todas las reservas
- `GET /api/reservas/fecha/:fecha` - Reservas por fecha
- `POST /api/reservas` - Crear reserva
- `POST /api/reservas/verificar-disponibilidad` - Verificar disponibilidad
- `PUT /api/reservas/:id/cancelar` - Cancelar reserva

### Inicialización
- `POST /api/init-data` - Crear las 4 canchas iniciales
- `GET /api/test` - Probar que la API funciona

## Sectores de Canchas

1. **Cancha 1** - Sector 1 con césped natural
2. **Cancha 2** - Sector 2 con césped sintético  
3. **Cancha 3** - Sector 3 mixta
4. **Cancha 4** - Sector 4 para entrenamientos

## Funcionalidades

- ✅ Visualizar disponibilidad de canchas por horario
- ✅ Reservar sectores específicos
- ✅ Evitar conflictos de horarios
- ✅ Gestión simple sin autenticación
- ✅ Vista de calendario/horarios
- ✅ Cancelación de reservas

## Próximos Pasos

1. ✅ Backend completado
2. ✅ Frontend React completado
3. ✅ Componentes integrados
4. ✅ API funcionando
5. 🔄 **Listo para probar!**

## Cómo Ejecutar el Sistema Completo

### 1. Backend (Terminal 1):
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend (Terminal 2):
```bash
cd frontend
npm start
```

### 3. Inicializar datos:
- Ve a: http://localhost:3000
- El sistema se inicializa automáticamente

## ✅ Sistema Completado

**Backend**:
- ✅ Express.js + Sequelize + MySQL
- ✅ 4 sectores de canchas configurados
- ✅ API REST completa
- ✅ Prevención de conflictos
- ✅ Modelos y relaciones

**Frontend**:
- ✅ React con componentes funcionales
- ✅ Calendario visual interactivo
- ✅ Formulario de reservas
- ✅ Verificación de disponibilidad
- ✅ Cancelación de reservas
- ✅ Diseño responsive

¡El piloto funcional está listo para usar! 🚀