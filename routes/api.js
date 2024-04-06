const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/create_room', authController.create_room);
router.post('/join_room', authController.join_room);


module.exports = router;
