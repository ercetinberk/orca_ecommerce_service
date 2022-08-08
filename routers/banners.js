const express=require("express")
const {getAllBannerImages} = require("../controllers/bannerController")
//api/questions
const router = express.Router()

router.get("/",getAllBannerImages)

module.exports=router