const asyncErrorWrapper = require("express-async-handler");
const DBCommands = require("../helpers/database/dbCommands");
const {Get_All_Settings} = require("../helpers/database/databaseQueries");

const getAllSettings =asyncErrorWrapper(async (req, res) => {
    const jsonQuery = await DBCommands.runQuery(Get_All_Settings);
    res.status(200).json({
      status: "success",
      message: {'table':'Settings','data':jsonQuery.recordset[0]},
    });
  });

module.exports={getAllSettings}
