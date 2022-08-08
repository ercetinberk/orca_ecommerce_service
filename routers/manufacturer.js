const express=require("express")
const {getAllManufacturers} = require("../controllers/manufacturerController")
//api/questions
const router = express.Router()

router.get("/",getAllManufacturers)

module.exports=router