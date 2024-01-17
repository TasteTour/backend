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

/* ============================================================================== */
/**
 * apiUserController (고객의 정보를 조회하는 Controller)
 */

/**
 * @swagger
 *  /user/register:
 *      post:
 *          summary: 회원가입
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
 *                              httpStatus: Conflict
 *                              message: 이메일 중복으로 회원 가입이 불가합니다!
 *              500:
 *                  description: DB 오류로 인한 오류 발생
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/HttpResponse'
 *                          example:
 *                              code: 500
 *                              httpStatus: Internal Server Error
 *                              message: 회원 가입 DB 구성 중 오류가 발생했습니다
 */
router.post('/user/register', apiUserController.register);

/**
 * @swagger
 *  /user/login:
 *      post:
 *          summary: 로그인
 *          tags:
 *              - User
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/UserLogin'
 *                      example:
 *                          memberEmail: abc@tukorea.ac.kr
 *                          memberPassword: password
 *
 *          responses:
 *              200:
 *                  description: 로그인 성공
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/HttpResponse'
 *                          example:
 *                              code: 200
 *                              httpStatus: OK
 *                              message: 전현준님 로그인 되었습니다.
 *                              data: {
 *                                  memberName: 전현준,
 *                                  memberEmail: "abc@tukorea.ac.kr",
 *                                  memberPhone: "01012345688",
 *                                  Authorization: "JWT token"
 *                              }
 *              401:
 *                  description: 로그인 실패
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/HttpResponse'
 *                          example:
 *                              code: 401
 *                              httpStatus: Unauthorized
 *                              message: 이메일 또는 비밀번호가 틀립니다
 */
router.post('/user/login', apiUserController.login);

/**
 * @swagger
 *  /user/logout:
 *      delete:
 *          summary: 로그아웃
 *          security:
 *              - Authorization: []
 *          tags:
 *              - User
 *          parameters:
 *            - in: header
 *              name: Authorization
 *              schema:
 *                  type: string
 *              description: 우측 상단 좌물쇠 버튼을 눌러 값을 넣은 후 테스트 해주세요! 아래에는 값을 넣지 말고 테스트 해주세요!!
 *
 *          responses:
 *              200:
 *                  description: 로그인 성공
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/HttpResponse'
 *                          example:
 *                              code: 200
 *                              httpStatus: OK
 *                              message: 전현준님 로그인 되었습니다.
 *                              data: {
 *                                  memberName: 전현준,
 *                                  memberEmail: "abc@tukorea.ac.kr",
 *                                  memberPhone: "01012345688",
 *                                  Authorization: "JWT token"
 *                              }
 *              401:
 *                  description: 로그인 실패
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/HttpResponse'
 *                          example:
 *                              code: 401
 *                              httpStatus: Unauthorized
 *                              message: 이메일 또는 비밀번호가 틀립니다
 */
router.delete('/user/logout', verify, apiUserController.logout);

/* ============================================================================== */

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