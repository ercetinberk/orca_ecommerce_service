const asyncErrorWrapper = require("express-async-handler");
const DBCommands = require("../helpers/database/dbCommands");
const {Get_All_Banner_Images} = require("../helpers/database/databaseQueries");
const getAllBannerImages =asyncErrorWrapper(async (req, res) => {
  const jsonQuery = await DBCommands.runQuery(Get_All_Banner_Images );
  res.status(200).json({
    status: "success",
    message: {'table':'Banner','data':jsonQuery.recordset},
  });
});
module.exports={getAllBannerImages}