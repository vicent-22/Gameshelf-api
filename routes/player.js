const express = require('express');
const router = express.Router();
const playerController = require('../controllers/player.controller')
const uploadImg = require('../middleware/uploadImg');

router.get('/register', playerController.openRegister)
router.post('/register', uploadImg("usuarios"), playerController.register)
router.get('/usuario/:id', playerController.onePlayer)
router.get('/login', playerController.login)
router.post('/login', playerController.insertLogin)

module.exports = router;
