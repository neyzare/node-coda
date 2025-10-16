export const SignupDto = {
    body: {
        type: 'object',
        properties: {
            mail: { type: 'string' },
            pwd: { type: 'string' },
        },
        required: ['mail', 'pwd'],
    },
    repsonse: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                mail: { type: 'string' }
            },
            required: ['id', 'mail', 'pwd']
        }
    }
};

export const LoginDto = {
    repsonse: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                mail: { type: 'string' },
                token: { type: 'string' }
            },
            required: ['id', 'mail']
        }
    }
};