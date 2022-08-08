const express=require("express")
const {getAllCategories,getSelectedCategorySubCategoryNames,getSelectedCategorySubCategories} = require("../controllers/categoryController")
//api/questions
const router = express.Router()

router.get("/",getAllCategories)
router.get("/viewproductgroupsnames",getSelectedCategorySubCategoryNames)
router.get("/viewproductgroups",getSelectedCategorySubCategories)
module.exports=router