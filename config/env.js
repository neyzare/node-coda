import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env') })

/**
 * Configuration centralisée de l'application
 * Toutes les variables d'environnement sont validées et exportées ici
 */

// Validation des variables requises
const requiredEnvVars = [
  'JWT_SECRET'
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variable d'environnement manquante: ${envVar}`)
  }
}

// DATABASE_URL avec fallback sur MYSQL_ADDON_URI (pour Clever Cloud)
const databaseUrl = (process.env.DATABASE_URL || process.env.MYSQL_ADDON_URI)?.trim()
if (!databaseUrl) {
  throw new Error('Variable d\'environnement manquante: DATABASE_URL ou MYSQL_ADDON_URI')
}

export const config = {
  // Base de données
  database: {
    url: databaseUrl
  },

  // Serveur
  server: {
    port: parseInt((process.env.PORT || '3000').trim(), 10),
    host: (process.env.HOST || '0.0.0.0').trim(),
    nodeEnv: (process.env.NODE_ENV || 'development').trim()
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET?.trim(),
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d').trim()
  },

  // Bcrypt
  bcrypt: {
    rounds: parseInt((process.env.BCRYPT_ROUNDS || '10').trim(), 10)
  },

  // Logs
  logs: {
    level: (process.env.LOG_LEVEL || 'info').trim(),
    prettyPrint: process.env.PRETTY_PRINT?.trim() === 'true'
  },

  // Helpers
  isDevelopment: () => process.env.NODE_ENV?.trim() === 'development',
  isProduction: () => process.env.NODE_ENV?.trim() === 'production',
  isTest: () => process.env.NODE_ENV?.trim() === 'test'
}

// Validation des types
if (isNaN(config.server.port)) {
  throw new Error('PORT doit être un nombre')
}

if (isNaN(config.bcrypt.rounds)) {
  throw new Error('BCRYPT_ROUNDS doit être un nombre')
}

// Log de la configuration au démarrage (sans les secrets)
if (config.isDevelopment()) {
  console.log('📝 Configuration chargée:')
  console.log('  - Environment:', config.server.nodeEnv)
  console.log('  - Port:', config.server.port)
  console.log('  - Host:', config.server.host)
  console.log('  - JWT expires in:', config.jwt.expiresIn)
  console.log('  - Bcrypt rounds:', config.bcrypt.rounds)
}

