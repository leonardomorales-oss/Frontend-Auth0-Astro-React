import express from 'express';
import cors from 'cors';
import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración Auth0
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

// Conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Ruta pública (sin autenticación)
app.get('/api/public', (req, res) => {
  res.json({ message: 'Esta es una ruta pública' });
});

// Ruta protegida (requiere autenticación)
app.get('/api/protected', jwtCheck, (req, res) => {
  res.json({ 
    message: 'Esta es una ruta protegida',
    user: req.auth.payload 
  });
});

// Ruta para obtener perfil de usuario
app.get('/api/profile', jwtCheck, async (req, res) => {
  try {
    const userId = req.auth.payload.sub;
    
    // Guardar/actualizar usuario en la base de datos
    await pool.query(
      `INSERT INTO users (auth0_id, email, name, created_at) 
       VALUES ($1, $2, $3, NOW()) 
       ON CONFLICT (auth0_id) 
       DO UPDATE SET last_login = NOW()`,
      [userId, req.auth.payload.email, req.auth.payload.name]
    );

    // Obtener datos del usuario
    const userResult = await pool.query(
      'SELECT * FROM users WHERE auth0_id = $1',
      [userId]
    );

    res.json({ 
      profile: req.auth.payload,
      userData: userResult.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para datos de usuario específicos de la app
app.get('/api/user-data', jwtCheck, async (req, res) => {
  try {
    const userId = req.auth.payload.sub;
    
    const result = await pool.query(
      `SELECT u.*, 
              COALESCE((
                SELECT json_agg(p.*) 
                FROM user_preferences p 
                WHERE p.user_id = u.id
              ), '[]') as preferences
       FROM users u 
       WHERE u.auth0_id = $1`,
      [userId]
    );

    res.json(result.rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta de salud para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Ruta protegida: http://localhost:${PORT}/api/protected`);
  console.log(`🌐 Ruta pública: http://localhost:${PORT}/api/public`);
});