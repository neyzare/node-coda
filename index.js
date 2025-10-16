import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { registerPostRoutes } from "./controller/post.js";
import { registerCategoryRoutes } from "./controller/category.js";
import { auth } from "./controller/auth.js";
import { config } from "./config/env.js";
import { registerAuthMiddlewares } from "./middlewares/auth.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const fastify = Fastify({
  logger: config.isDevelopment() ? {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname'
      }
    },
    level: config.logs.level
  } : {
    level: config.logs.level
  }
})

await fastify.register(fastifySwagger, {
  openapi: {
    components: {
      securitySchemes:{
        token: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  }
})

await fastify.register(fastifySwaggerUi,{
  routePrefix : "/documentation",
  uiConfig: {
    docExpansion: "list"
  }

})

// Configuration JWT avec dotenv
fastify.register(fastifyJwt, {
  secret: config.jwt.secret,
  sign: {
    expiresIn: config.jwt.expiresIn
  }
})

// Enregistrer les middlewares d'authentification
registerAuthMiddlewares(fastify)

// Décorateur pour vérifier l'authentification
fastify.decorate("authenticate", async function(request, reply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.code(401).send({ error: 'Non autorisé' })
  }
})

fastify.get("/", async function handler (request, reply){
  return {
    hello: 'world',
    environment: config.server.nodeEnv,
    version: '1.0.0'
  }
})

registerPostRoutes(fastify)
registerCategoryRoutes(fastify)
auth(fastify)

try {
  await fastify.listen({
    port: config.server.port,
    host: config.server.host
  })
  fastify.log.info(`🚀 Serveur démarré sur http://${config.server.host}:${config.server.port}`)
}catch(err) {
  fastify.log.error(err)
  process.exit(1)
}

await fastify.ready()
