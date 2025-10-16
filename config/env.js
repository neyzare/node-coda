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
  'DATABASE_URL',
  'JWT_SECRET'
]

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variable d'environnement manquante: ${envVar}`)
  }
}

export const config = {
  // Base de données
  database: {
    url: process.env.DATABASE_URL
  },

  // Serveur
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // Bcrypt
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10)
  },

  // Logs
  logs: {
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: process.env.PRETTY_PRINT === 'true'
  },

  // Helpers
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
  isTest: () => process.env.NODE_ENV === 'test'
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

