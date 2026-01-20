const express = require('express');
const router = express.Router();
const uploadImg = require('../middleware/uploadImg')
const gameController = require('../controllers/game.controller');

router.get('/formGamePlayer/:id_player', gameController.openFormGamePlayer);
router.post('/addGamePlayer/:id_player', uploadImg("games"), gameController.addGamePlayer)
router.get('/addNewGame', gameController.addGameInicio)
router.post('/addNewGame',uploadImg('games'), gameController.insertGameInicio)
router.get('/editGame/:id_game', gameController.openEditGame)
router.post('/editGame/:id_game/:id_player', gameController.editGame)
router.get('/deleteGame/:id_game/:id_player', gameController.deleteGame)
router.get('/infoGame/:id_game', gameController.infoGame)

module.exports = router;
