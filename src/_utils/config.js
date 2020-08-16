const prod = {
    url: {
        API_URL: 'https://pos-inventory-shift.herokuapp.com/graphql',
        // API_URL: '/graphql',
    }
};
const dev = {
    url: {
        // API_URL: 'http://192.168.2.20:3333/graphql' // bowmanville
        API_URL: 'http://localhost:3333/graphql' //
    }
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
