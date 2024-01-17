const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Taste Tour",
            version: "1.0.0",
            description: "2023 현장프로젝트 교과 맛탐험 정왕동 API 문서입니다.",
        },
        components: {
            securitySchemes: {
                Authorization: {
                    type: "apiKey",
                    in: "header",
                    name: "Authorization",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
            },
        },
        security: [
            {
                Authorization: [], // 전역적으로 토큰이 필요한 경우
            },
        ],
        servers: [
            {
                url: "http://localhost:3000/",
            },
        ],
    },
    apis: ["./src/*.js", "./src/swagger/*"],
};

const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs };
