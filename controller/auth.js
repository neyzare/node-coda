import { userRepository } from "../repositories/local/user.js";
import { SignupDto, LoginDto } from "../dtos/userDto.js";

export function auth(fastify) {
    fastify.post('/login', { schema: LoginDto }, async function login(request, reply) {
        const body = request.body;
        const user = await userRepository.getUserByCredentials(body.mail, body.pwd);
        if(!user) {
            throw new Error ('Invalid credentials');
        }
        const token = fastify.jwt.sign({ id: user.id });
        return { ...user, token };
    });

    fastify.post('/signup', { schema: SignupDto } , async function signup(request, reply) {
        const body = request.body;
        const user = await userRepository.createUser(body.mail, body.pwd);
        return user;
    });
}
