# Autenticación con Auth0: React y API

Frontend React con Auth0 y API Express protegida mediante JWT, conectada a PostgreSQL.

## Tecnologías

- React
- Auth0
- Express
- PostgreSQL
- JWT

## Instalación y ejecución

Crea `backend/.env` a partir de `backend/.env.example` y completa valores locales de Auth0/PostgreSQL. En `frontend-react/.env.local` completa `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID` y `VITE_AUTH0_AUDIENCE`.

Backend: `cd backend && npm install && npm run dev`. Frontend: `cd frontend-react && npm install && npm run dev`.

## Uso

Inicia sesión y prueba rutas públicas y protegidas.

## Repositorio

[leonardomorales-oss/Frontend-Auth0-Astro-React](https://github.com/leonardomorales-oss/Frontend-Auth0-Astro-React)

> No subas archivos `.env`. El archivo `backend/.env` estuvo versionado públicamente y ya se retiró del estado actual. Si su contraseña era real, rótala. Borrarlo no elimina las copias del historial anterior de Git.
