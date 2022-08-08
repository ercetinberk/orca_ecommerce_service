const express=require("express")
const {getAllCartProducts,addToCart,removeFromCart, updateCartProduct, checkoutCart, updateDeliveryMethod,getAllCartProductsForMobile} = require("../controllers/cartController")
const { getAccessToRoute } = require("../middlewares/authorization/auth")
//api/questions
const router = express.Router()

router.get("/",getAccessToRoute,getAllCartProducts)
router.post("/add",getAccessToRoute,addToCart)
router.post("/update",getAccessToRoute,updateCartProduct)
router.delete("/:cart_id/delete",getAccessToRoute,removeFromCart)
router.post("/checkout",getAccessToRoute,checkoutCart)
router.post("/changeDeliveryMethod",getAccessToRoute,updateDeliveryMethod)


//#region Mobile Services
router.get("/allproducts",getAllCartProductsForMobile)
//#endregion
module.exports=router

