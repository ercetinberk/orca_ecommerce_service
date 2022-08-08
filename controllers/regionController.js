const asyncErrorWrapper = require("express-async-handler");
const DBCommands = require("../helpers/database/dbCommands");
const {Get_All_Region} = require("../helpers/database/databaseQueries");

const getAllRegion =asyncErrorWrapper(async (req, res) => {
    const jsonQuery = await DBCommands.runQuery(Get_All_Region);
    res.status(200).json({
        success:true,
        message: {'table':'Region','data':jsonQuery.recordset},
    });
  });

module.exports={getAllRegion}
