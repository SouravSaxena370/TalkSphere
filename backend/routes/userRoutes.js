const express=require('express')
const {registerUser,authUser,allUsers}=require('../controllers/userControllers')
const router =express.Router()
const { protect }= require("../middleware/authMiddleware")

router.route('/').post(registerUser).get(protect,allUsers)
router.route('/login').post(authUser)
// router.route('/chats')

module.exports=router