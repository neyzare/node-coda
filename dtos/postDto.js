export const CreatePostDto = {
    body: {
        type: 'object',
        properties: {
            title: { type: 'string' },
            content: { type: 'string' },
        },
        required: ['title', 'content'],
    },
    repsonse: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                content: { type: 'string' },
            },
            required: ['id', 'title', 'content']
        }
    }
};

export const GetPostsDto = {
    querystring: {
        type: 'object',
        properties: {
            page: { type: 'number' },
            limit: { type: 'number' }
        }
    },
    repsonse: {
        200: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                    title: { type: 'string' },
                    content: { type: 'string' },
                },
            },
            required: ['id', 'title', 'content']
        }
    }
};

export const GetPostDto = {
    repsonse: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                content: { type: 'string' },
            },
            required: ['id', 'title', 'content']
        }
    }
};

export const UpdatePostDto = {
    body: {
        type: 'object',
        properties: {
            title: { type: 'string' },
            content: { type: 'string' },
        },
        required: ['title', 'content']
    },
    response: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                content: { type: 'string' },
            },
            required: ['id', 'title', 'content']
        }
    }
};

export const DeletePostDto = {
    repsonse: {
        200: {
            type: 'object',
            properties: {
                id: { type: 'number' },
                title: { type: 'string' },
                content: { type: 'string' },
            },
            required: ['id']
        }
    }
};