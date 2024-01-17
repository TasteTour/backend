const swaggerUi = require("swagger-ui-express");
const swaggereJsdoc = require("swagger-jsdoc");

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: { // info 객체는 title, version, description을 설정
            title: "Taste Tour",
            version: "1.0.0",
            description: "2023 현장프로젝트 교과 맛탐험 정왕동 API 문서입니다.",
        },
        /*
        securityDefinitions: { // 헤더의 Authorization안에 값을 넣어줄수 있는 기능
            Authorization: {
                type: "apiKey",
                name: "authorization",
                scheme: "bearer",
                in: "header",
            },
        },
        security: [ // 헤더의 Authorization안에 값을 넣어줄수 있는 기능
            {
                Authorization: [],
            },
        ],
        */
        host: "localhost:3000",
        basePath: "/",
    },
    apis: ["./src/*.js", "./src/swagger/*"], // api는 /routes 파일 아래 js 파일 내에 정의하고 있으며, /swagger 폴더 아래 swagger 설정을 정의하고 있다
};

const specs = swaggereJsdoc(options);

module.exports = { swaggerUi, specs };