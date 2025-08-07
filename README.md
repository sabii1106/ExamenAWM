# Sistema de Reservas de Canchas de Fútbol

Sistema MERN para gestionar reservas de los 4 sectores de canchas de fútbol para grupos estudiantiles.

## Estructura del Proyecto

```
ExamenAWM/
├── backend/          # API con Express.js + Sequelize + MySQL
├── frontend/         # React App (en instalación)
├── database/         # Scripts SQL
└── README.md
```

## Requisitos Previos

- Node.js (v16 o superior)
- MySQL Server
- MySQL Workbench (opcional)

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