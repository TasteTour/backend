const express = require('express')
const router  = express.Router();
const logging = require('./middleware/logging')
const verify = require('./middleware/jwtVerify');

// 파일 업로드를 위한 multer 모듈
const multer = require('multer')
const upload = multer({dest : 'public/storage'}) // 소스를 잘 설정해야함

const webController = require('./web/webController');
const apiUserController = require('./api/user/userController');
const apiFeedController = require('./api/feed/feedController');
const fileController = require('./api/file/fileController')

// 전체 적용 (router.get 보다 먼저 선언해야 사용 가능함!)
router.use(logging)

/**
 * fileController
 */
router.post('/api/file', upload.single('file'), fileController.upload);
router.get('/api/file/:id', fileController.download);

/**
 * webController (기본 페이지)
 */
router.get('/', webController.home);
router.get('/page/:page',webController.page);
router.get('/sitemap',webController.sitemap);


/**
 * apiUserController (고객의 정보를 조회하는 Controller)
 */
// 로깅 동시에 적용 가능함
router.get('/api/user/:id', apiUserController.userinfo);
router.post('/api/user/register', apiUserController.register);
router.post('/api/user/login', apiUserController.login);


/**
 * apiFeedController (피드 CRUD 하는 부분)
 */
// middleware로 jwt 인증을 보냄
router.get('/api/feed', verify, apiFeedController.index);
router.post('/api/feed', verify,  apiFeedController.store);
router.get('/api/feed/:id', verify, apiFeedController.show);
router.post('/api/feed/:id', verify, apiFeedController.update);
router.post('/api/feed/:id/delete', verify, apiFeedController.destroy);

module.exports = router;