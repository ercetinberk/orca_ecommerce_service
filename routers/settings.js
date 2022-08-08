const express=require("express")
const {getAllSettings} = require("../controllers/settingController")
//api/questions
const router = express.Router()

router.get("/",getAllSettings)

module.exports=router