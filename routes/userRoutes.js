const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router();

router.route('/createUser').post(userController.createUser)
router.route('/:userId').get(userController.getUser)
router.route('/').get(userController.getAllUser)
router.route('/in/:userId').patch(userController.punchIn)
router.route('/out/:userId').patch(userController.punchOut)
router.route('/stats/getStats').get(userController.getStatisticsForMonth)

module.exports = router