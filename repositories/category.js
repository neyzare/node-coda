import { prisma } from "../services/db.js";

export const CategoryRepository = {
    getCategories: async () => {
        return await prisma.category.findMany({
            include: {
                _count: {
                    select: { posts: true }
                }
            }
        });
    },

    getCategory: async (id) => {
        return await prisma.category.findUnique({
            where: {
                id: id
            },
            include: {
                posts: true
            }
        });
    },

    createCategory: async (data) => {
        return await prisma.category.create({
            data: {
                name: data.name,
                description: data.description
            }
        });
    },

    updateCategory: async (id, data) => {
        return await prisma.category.update({
            where: {
                id: id
            },
            data: data
        });
    },

    deleteCategory: async (id) => {
        return await prisma.category.delete({
            where: {
                id: id
            }
        });
    }
};

