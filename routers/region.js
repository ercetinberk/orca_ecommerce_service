const express=require("express")
const {getAllRegion} = require("../controllers/regionController")
//api/questions
const router = express.Router()

router.get("/",getAllRegion)

module.exports=router