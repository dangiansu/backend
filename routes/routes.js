const express = require('express')
const router = express.Router()
const  UserController = require('../controllers/user')
const {upload} = require('../middlewares/uplodefile')
router.post('/api/register',upload("user_image"),UserController.register)
router.post('/api/login',UserController.login)
module.exports = router