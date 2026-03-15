# Movies API

API REST para gestión de películas con sistema de autenticación y favoritos.

## Tech Stack

- **Framework**: NestJS
- **Base de datos**: PostgreSQL + TypeORM
- **Autenticación**: JWT + Passport
- **External API**: The Movie Database (TMDB)

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env` basado en `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=movies_db

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

TMDB_API_KEY=your-tmdb-api-key
TMDB_BASE_URL=https://api.themoviedb.org/3
```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## Testing

```bash
npm run test        # Tests unitarios
npm run test:e2e    # Tests E2E
npm run test:cov    # Coverage
```

## API Endpoints

### Auth

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión

### Movies

- `GET /movies` - Listar películas
- `GET /movies/:id` - Obtener película
- `POST /movies` - Crear película
- `PUT /movies/:id` - Actualizar película
- `DELETE /movies/:id` - Eliminar película
- `GET /movies/external/:externalId` - Buscar en TMDB

### Favorites

- `GET /favorites` - Listar favoritos del usuario
- `POST /favorites/:movieId` - Añadir a favoritos
- `DELETE /favorites/:movieId` - Quitar de favoritos

### Users

- `GET /users/profile` - Perfil del usuario
- `PUT /users/profile` - Actualizar perfil

## Estructura del Proyecto

```
src/
├── modules/
│   ├── auth/        # Autenticación
│   ├── users/      # Gestión de usuarios
│   ├── movies/     # Películas
│   └── favorites/  # Sistema de favoritos
├── domain/
│   └── entities/   # Entidades TypeORM
└── main.ts
```
