import express from 'express'
import {signup,login,forget_pass, resetPassword, GetUserData,logout} from '../controller/user.controller.js'
import { SecureRoute } from '../middleware/SecureRoute.js'


const router=express.Router()


router.post('/signup',signup)
router.get('/GetUserData',SecureRoute,GetUserData)
router.post('/login',login)

router.post('/forget_pass',forget_pass)
router.post('/resetPassword/:token',resetPassword)


export default router