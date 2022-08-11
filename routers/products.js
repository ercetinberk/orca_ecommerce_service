const express=require("express")
const {getProducts,getWebOfferProducts,getCardProduct,getSearchProducts,getProductForMobile} = require("../controllers/productController")
//api/questions
const router = express.Router()

router.get("/",getProducts)
router.get("/weboffers",getWebOfferProducts)
router.get("/card/:item_no",getCardProduct)
router.get("/search",getSearchProducts)
router.get("/getProductForMobile",getProductForMobile)


module.exports=router