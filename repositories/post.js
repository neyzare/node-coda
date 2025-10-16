import { prisma } from "../services/db.js";

export const PostRepository = { 
    getPosts: async (page, limit) => {
        try {
            return await prisma.post.findMany({
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    category: true
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des posts: ${error.message}`);
        }
    },

    getPost: async (id) => {
        try {
            const post = await prisma.post.findUnique({
                where: {
                    id: id
                },
                include: {
                    category: true
                }
            });
            
            if (!post) {
                throw new Error(`Post avec l'id ${id} introuvable`);
            }
            
            return post;
        } catch (error) {
            throw error;
        }
    },

    createPost: async (data) => {
        try {
            return await prisma.post.create({
                data: {
                    title: data.title,
                    content: data.content,
                    categoryId: data.categoryId
                },
                include: {
                    category: true
                }
            });
        } catch (error) {
            throw new Error(`Erreur lors de la création du post: ${error.message}`);
        }
    },

    updatePost: async (id, post) => {
        try {
            const existingPost = await prisma.post.findUnique({
                where: { id: id }
            });
            
            if (!existingPost) {
                throw new Error(`Post avec l'id ${id} introuvable`);
            }
            
            return await prisma.post.update({
                where: {
                    id: id
                },
                data: post,
                include: {
                    category: true
                }
            });
        } catch (error) {
            throw error;
        }
    },

    deletePost: async (id) => {
        try {
            const existingPost = await prisma.post.findUnique({
                where: { id: id }
            });
            
            if (!existingPost) {
                throw new Error(`Post avec l'id ${id} introuvable`);
            }
            
            return await prisma.post.delete({
                where: {
                    id: id
                }
            });
        } catch (error) {
            throw error;
        }
    }
};
