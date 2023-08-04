const path = require('path');

module.exports = {
    openapi: '3.0.0',
    info: {
        // API informations (required)
        title: 'Node-Typescript API', // Title (required)
        version: '1.0.0', // Version (required)
        description: 'A sample API', // Description (optional)
    },
    servers: [
        { url: 'http://192.168.0.119:3000' },
        { url: 'https://mongo-kompletee.herokuapp.com' },
        { url: 'http://localhost:3000' },
        { url: 'http://ec2-18-216-130-99.us-east-2.compute.amazonaws.com:3000' },
        { url: 'http://ec2-3-22-60-204.us-east-2.compute.amazonaws.com:3000' }
    ],
    apis: [path.join(__dirname, './src/**/**/*.ts')]
};
