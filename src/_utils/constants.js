const prod = {
    url: {
        API_URL: '/graphql',
    }
};
const dev = {
    url: {
        API_URL: 'http://localhost:3333/graphql'
    }
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;