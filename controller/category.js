import { CategoryRepository } from "../repositories/category.js";
import { CreateCategoryDto, GetCategoriesDto, GetCategoryDto, UpdateCategoryDto, DeleteCategoryDto } from "../dtos/categoryDto.js";

export function registerCategoryRoutes(fastify) {
    // Lister toutes les catégories
    fastify.get('/categories', { schema: GetCategoriesDto }, async function getCategories(request, reply) {
        return await CategoryRepository.getCategories();
    });

    // Récupérer une catégorie par ID avec ses posts
    fastify.get('/categories/:id', { schema: GetCategoryDto }, async function getCategory(request, reply) {
        const id = parseInt(request.params.id);
        const category = await CategoryRepository.getCategory(id);
        
        if (!category) {
            reply.code(404);
            return { error: 'Catégorie non trouvée' };
        }
        
        return category;
    });

    // Créer une nouvelle catégorie (protégé par JWT)
    fastify.post('/categories', {
        onRequest: [fastify.authenticate],
        schema: CreateCategoryDto
    }, async function createCategory(request, reply) {
        const body = request.body;
        
        try {
            const newCategory = await CategoryRepository.createCategory(body);
            reply.code(201);
            return newCategory;
        } catch (error) {
            if (error.code === 'P2002') {
                reply.code(409);
                return { error: 'Une catégorie avec ce nom existe déjà' };
            }
            throw error;
        }
    });

    // Mettre à jour une catégorie (protégé par JWT)
    fastify.put('/categories/:id', {
        onRequest: [fastify.authenticate],
        schema: UpdateCategoryDto
    }, async function updateCategory(request, reply) {
        const id = parseInt(request.params.id);
        const body = request.body;
        
        try {
            const updatedCategory = await CategoryRepository.updateCategory(id, body);
            return updatedCategory;
        } catch (error) {
            if (error.code === 'P2025') {
                reply.code(404);
                return { error: 'Catégorie non trouvée' };
            }
            if (error.code === 'P2002') {
                reply.code(409);
                return { error: 'Une catégorie avec ce nom existe déjà' };
            }
            throw error;
        }
    });

    // Supprimer une catégorie (protégé par JWT)
    fastify.delete('/categories/:id', {
        onRequest: [fastify.authenticate],
        schema: DeleteCategoryDto
    }, async function deleteCategory(request, reply) {
        const id = parseInt(request.params.id);
        
        try {
            await CategoryRepository.deleteCategory(id);
            return { message: 'Catégorie supprimée avec succès' };
        } catch (error) {
            if (error.code === 'P2025') {
                reply.code(404);
                return { error: 'Catégorie non trouvée' };
            }
            if (error.code === 'P2003') {
                reply.code(409);
                return { error: 'Impossible de supprimer une catégorie qui contient des posts' };
            }
            throw error;
        }
    });
}

