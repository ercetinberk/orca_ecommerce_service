const express=require("express")
const {register,login,logout,getUser,updateUser,updatePassword,updateDeliveryMethod,getMobileUser} = require("../controllers/authController")
const {getAccessToRoute}= require("../middlewares/authorization/auth")
//api/auth
const router = express.Router()

router.post("/login",login)
router.post("/register",register)
router.get("/logout",getAccessToRoute,logout)
router.post("/edit",getAccessToRoute,updateUser)
router.post("/changePassword",getAccessToRoute,updatePassword)
router.get("/getUser",getAccessToRoute,getUser)
router.get("/getMobileUser",getMobileUser)
module.exports=router