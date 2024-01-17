const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
    // openapi: "3.0.0",
    info: {
        title: "Taste Tour",
        version: "1.0.0",
        description: "정왕동 맛탐험",
    },
    servers: [
        {
            url: "http://localhost:3000",
        },
    ],
};

const options = {
    swaggerDefinition,
    // 절대경로로 지정
    apis: ["src/*.js"],
};

const specs = swaggereJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};