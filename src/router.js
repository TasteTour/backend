const express = require('express')
const router = express.Router();
const logging = require('./middleware/logging')
const verify = require('./middleware/jwtVerify');
const {swaggerUi, specs} = require('./middleware/swagger');

/**
 * 파일 업로드를 위한 Multer 모듈
 * public/storage 폴더에 파일들이 저장이 되고 있음
 */
const multer = require('multer')
const upload = multer({dest: 'public/storage'}) // 소스를 잘 설정해야함

const apiUserController = require('./api/user/userController');
const apiFeedController = require('./api/board/boardController');
const fileController = require('./api/file/fileController')

// 전체 적용 (router.get 보다 먼저 선언해야 사용 가능함!)
router.use(logging)


router.post('/api/file', upload.single('file'), fileController.upload);
router.get('/api/file/:id', fileController.download);


/**
 * apiUserController (고객의 정보를 조회하는 Controller)
 */
// 로깅 동시에 적용 가능함
router.get('/api/user/:id', apiUserController.userinfo);

/**
 * @swagger
 *  /user/register:
 *      post:
 *          summary: Add a new pet
 *          tags:
 *              - User
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/UserRegister'
 *                      example:
 *                          memberName: 전현준
 *                          memberEmail: abc@tukorea.ac.kr
 *                          memberPhone: "01012345688"
 *                          memberPassword: password
 *
 *          responses:
 *              201:
 *                  description: 회원 가입 성공
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/HttpResponse'
 *                          example:
 *                              code: 201
 *                              httpStatus: CREATED
 *                              message: 회원가입 성공했습니다
 *                              data: {
 *                                  memberName: 전현준,
 *                                  memberEmail: "abc@tukorea.ac.kr",
 *                                  memberPhone: "01012345688"
 *                              }
 *              409:
 *                  description: 이메일 중복으로 인한 회원 가입 불가
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/HttpResponse'
 *                          example:
 *                              code: 409
 *                              httpStatus: CONFLICT
 *                              message: 이메일 중복으로 회원 가입이 불가합니다!
 *                              data: {null}
 */
router.post('/user/register', apiUserController.register);

router.post('/api/user/login', apiUserController.login);


/**
 * apiFeedController (피드 CRUD 하는 부분)
 */
// middleware로 jwt 인증을 보냄
router.get('/api/feed', verify, apiFeedController.index);
router.post('/api/feed', verify, apiFeedController.store);
router.get('/api/feed/:id', verify, apiFeedController.show);
router.post('/api/feed/:id', verify, apiFeedController.update);
router.post('/api/feed/:id/delete', verify, apiFeedController.destroy);

module.exports = router;