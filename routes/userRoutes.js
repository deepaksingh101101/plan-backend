import express from "express"
import {   loginController, registerController,sendOtp,verifyOtp } from "../controller/userController/userController.js";
import  {  loginDataValidate,newPasswordDataValidate, otpDataValidate, registerDataValidate }  from '../validation/loginDataValidate.js'


const userRouter=express.Router();


userRouter.post('/login',loginDataValidate,loginController)
userRouter.post('/register',registerDataValidate,registerController)
userRouter.post('/sendOtp',newPasswordDataValidate,sendOtp)
userRouter.post('/verifyOtp',otpDataValidate,verifyOtp)


export default userRouter;
