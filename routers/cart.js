const express=require("express")
const {getAllCartProducts,addToCart,removeFromCart, updateCartProduct, checkoutCart, updateDeliveryMethod,getAllCartProductsForMobile,addToCartForMobile,updateCartProductMobile,removeFromCartMobile,checkoutCartMobile} = require("../controllers/cartController")
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
router.post("/addMobile",addToCartForMobile)
router.post("/updateMobile",updateCartProductMobile)
router.post("/checkoutMobile",checkoutCartMobile)
router.post("/:cart_id/deleteMobile",removeFromCartMobile)
//#endregion
module.exports=router

