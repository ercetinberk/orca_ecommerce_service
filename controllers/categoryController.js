const asyncErrorWrapper = require("express-async-handler");
const DBCommands = require("../helpers/database/dbCommands");
const {Get_All_Categories} = require("../helpers/database/databaseQueries");

const getAllCategories =asyncErrorWrapper(async (req, res) => {
    const jsonQuery = await DBCommands.runQuery(Get_All_Categories);
    res.status(200).json({
      status: "success",
      message: {'table':'Category','data':jsonQuery.recordset},
    });
  });
  const getSelectedCategorySubCategoryNames =asyncErrorWrapper(async (req, res) => {
    let query=Get_All_Categories
    query+=` where parentcode='${req.query.parentcode}'`
    console.log(query);
    const jsonQuery = await DBCommands.runQuery(query);
    let names=""
    jsonQuery.recordset.map((cat,index)=>{
      console.log(cat,index);
      if(index<2) {names += `${cat.description},`}
      if(index===2) {names += `...`}
      
    })
    res.status(200).json({
      status: "success",
      names: names,
    });
  });
  const getSelectedCategorySubCategories =asyncErrorWrapper(async (req, res) => {
    let query=Get_All_Categories
    query+=` where parentcode='${req.query.parentcode}'`
    console.log(query);
    const jsonQuery = await DBCommands.runQuery(query);
    res.status(200).json({
      status: "success",
      message: {'table':'Category','data':jsonQuery.recordset},
    });
  });
module.exports={getAllCategories,getSelectedCategorySubCategoryNames,getSelectedCategorySubCategories}
