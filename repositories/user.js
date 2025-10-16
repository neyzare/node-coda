import { prisma } from "../services/db.js";

export const userRepository = {
    getUserByCredentials: async (mail, pwd) => {
        const user = await prisma.user.findFirst({
            where: {
                email: mail,
                password: pwd
            },
        });
        return user;
    },

    getUserById: async (id) => {
        const user = await prisma.user.findFirst({
            where: {
                id: id
            },
        });
        return user;
    },

    createUser: async (mail, pwd) => {
        return await prisma.user.create({
            data: {
                email: mail,
                password: pwd,
                username: mail.split('@')[0]
            },
        });
    },
}
