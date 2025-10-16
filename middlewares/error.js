export function registerErrorMiddleware(fastify){
  fastify.setErrorHandle((error,request, reply)=> {
    if (error.name === "NotFoundError") {
      reply.status(404).send({ok: false, message: error.message})
    } 
    else {
      reply.status(500).send({ok:false})
    }
  })
}