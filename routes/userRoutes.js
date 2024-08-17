import express from "express"
import {   loginController, registerController } from "../controller/userController/userController.js";
import  {  loginDataValidate,  registerDataValidate }  from '../validation/loginDataValidate.js'


const userRouter=express.Router();


userRouter.post('/login',loginDataValidate,loginController)
userRouter.post('/register',registerDataValidate,registerController)





export default userRouter;
