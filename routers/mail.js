const express=require("express")
const {sendMail} = require("../controllers/mailController")
//api/questions
const router = express.Router()

router.post("/",sendMail)

module.exports=router