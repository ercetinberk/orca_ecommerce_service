const express=require("express")
const {charge,secure,cancel} = require("../controllers/chargeController")
//api/questions
const router = express.Router()

router.post("/",charge)
router.post("/secure",secure)
router.post("/cancel",cancel)
module.exports=router