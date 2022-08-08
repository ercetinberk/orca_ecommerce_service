const express=require("express")
const {getProducts,getWebOfferProducts,getCardProduct,getSearchProducts} = require("../controllers/productController")
//api/questions
const router = express.Router()

router.get("/",getProducts)
router.get("/weboffers",getWebOfferProducts)
router.get("/card/:item_no",getCardProduct)
router.get("/search",getSearchProducts)

module.exports=router