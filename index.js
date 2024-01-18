require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const { swaggerUi, specs } = require('./src/middleware/swagger');
const {boardAddComment} = require("./src/api/board/boardRepository");


// post 처리를 위한 body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// public 디렉토리를 서버의 정적파일 디렉토리로 사용함.
app.use(express.static('public'));

// 분리된 라우터 파일 로드하는 부분
app.use(require('./src/router'));

// Swagger를 작동시키기 위함
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
    console.log(`서버 실행 중 ${port}`)
})

boardAddComment(1);