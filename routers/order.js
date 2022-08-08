const express=require("express")
const {getCustomerPendingOrders,getCustomerPendingOrderLines,getCustomerCompletedOrders,getCustomerCompletedOrderLines} = require("../controllers/orderController")
const { getAccessToRoute } = require("../middlewares/authorization/auth")
//api/order
const router = express.Router()
router.get("/pendingorders",getAccessToRoute,getCustomerPendingOrders)
router.get("/pendingorders/:document_no/lines",getAccessToRoute,getCustomerPendingOrderLines)
router.get("/completedorders",getAccessToRoute,getCustomerCompletedOrders)
router.get("/completedorders/:document_no/lines",getAccessToRoute,getCustomerCompletedOrderLines)
module.exports=router

