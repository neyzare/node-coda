import { PostRepository } from "../repositories/post.js";
import { GetPostsDto, GetPostDto, CreatePostDto, UpdatePostDto, DeletePostDto } from "../dtos/postDto.js";

export function registerPostRoutes(fastify) {
    fastify.get('/posts', { schema: GetPostsDto }, async function getPosts(request, reply) {
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 10;
        return await PostRepository.getPosts(page, limit);
    });

    fastify.get('/posts/:id', { schema: GetPostDto }, async function getPost(request, reply) {
        try {
            const id = parseInt(request.params.id);
            return await PostRepository.getPost(id);
        } catch (error) {
            reply.code(404).send({ error: error.message });
        }
    });

    fastify.post('/posts', { schema: CreatePostDto }, async function createPost(request, reply) {
        try {
            const body = request.body;
            return await PostRepository.createPost(body);
        } catch (error) {
            reply.code(400).send({ error: error.message });
        }
    });

    fastify.put('/posts/:id', { 
        onRequest: [fastify.authenticate],
        schema: UpdatePostDto 
    }, async function updatePost(request, reply) {
        try {
            const id = parseInt(request.params.id);
            const body = request.body;
            return await PostRepository.updatePost(id, body);
        } catch (error) {
            reply.code(404).send({ error: error.message });
        }
    });

    fastify.delete('/posts/:id', { 
        onRequest: [fastify.authenticate], 
        schema: DeletePostDto 
    }, async function deletePost(request, reply) {
        try {
            const id = parseInt(request.params.id);
            return await PostRepository.deletePost(id);
        } catch (error) {
            reply.code(404).send({ error: error.message });
        }
    });
}