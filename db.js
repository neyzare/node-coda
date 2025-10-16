import { PrismaClient } from "./generated/prisma/index.js";
import { config } from "./config/env.js";

let client = new PrismaClient({
  log: config.isDevelopment() 
    ? ['query', 'info', 'warn', 'error']
    : ['error']
})

await client.$connect()

if (config.isDevelopment()) {
  console.log('✅ Base de données connectée')
}

export const prisma = client