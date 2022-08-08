const asyncErrorWrapper = require("express-async-handler");
const DBCommands = require("../helpers/database/dbCommands");
const {Get_All_Manufacturer} = require("../helpers/database/databaseQueries");

const getAllManufacturers =asyncErrorWrapper(async (req, res) => {
    const jsonQuery = await DBCommands.runQuery(Get_All_Manufacturer);
    res.status(200).json({
      status: "success",
      message: {'table':'Manufacturer','data':jsonQuery.recordset},
    });
  });

module.exports={getAllManufacturers}
