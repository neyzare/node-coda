import { userRepository } from "../repositories/local/user.js";

export function registerAuthMiddlewares(fastify) {
    fastify.decorate('authUser', async function (request, reply) {
        const authHeader = request.headers['authorization'];
        
        if(!authHeader) {
            reply.code(401).send({ error: 'Token not found' });
            return;
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            const payload = fastify.jwt.verify(token);
            const user = await userRepository.getUserById(payload.id);

            if(!user) { 
                reply.code(404).send({ error: 'User not found' });
                return;
            }

            request.user = user;
        } catch (err) {
            console.error(err);
            reply.code(401).send({ error: 'Invalid token' });
            return;
        }
    })
}