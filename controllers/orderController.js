const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const DBCommands = require("../helpers/database/dbCommands");
const {
  generateJwtFromUser,
} = require("../helpers/authorization/tokenHelpers");
const {
    Get_Customer_Pending_Orders,Get_Customer_Pending_Order_Lines,
    Get_Customer_Completed_Orders,Get_Customer_Completed_Order_Lines
  
} = require("../helpers/database/databaseQueries");
const getCustomerPendingOrders = asyncErrorWrapper(async (req, res) => {
  let query = Get_Customer_Pending_Orders;
  if (req.auth.customerno)
    query += " where [selltocustomerno] ='" + req.auth.customerno + "'";

  const jsonQuery = await DBCommands.runQuery(query);
  const token = generateJwtFromUser(req.auth.customerno, req.auth.email);
  const { NODE_ENV, JWT_COOKIE } = process.env;
  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      access_token: token,
      message: { table: "PendingOrders", data: jsonQuery.recordset },
    });
});
const getCustomerCompletedOrders = asyncErrorWrapper(async (req, res) => {
  let query = Get_Customer_Completed_Orders;
  if (req.auth.customerno)
    query += " where [selltocustomerno] ='" + req.auth.customerno + "'";
  const jsonQuery = await DBCommands.runQuery(query);
  const token = generateJwtFromUser(req.auth.customerno, req.auth.email);
  const { NODE_ENV, JWT_COOKIE } = process.env;
  res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      access_token: token,
      message: { table: "CompletedOrders", data: jsonQuery.recordset },
    });
});
const getCustomerPendingOrderLines = asyncErrorWrapper(async (req, res) => {
    const { document_no } = req.params;
    let query = Get_Customer_Pending_Order_Lines;
    if (req.auth.customerno)
      query += " where [documentno] ='" + document_no + "'";
    console.log(query);
    const jsonQuery = await DBCommands.runQuery(query);
    const token = generateJwtFromUser(req.auth.customerno, req.auth.email);
    const { NODE_ENV, JWT_COOKIE } = process.env;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000),
        secure: NODE_ENV === "development" ? false : true,
      })
      .json({
        success: true,
        access_token: token,
        message: { table: "PendingOrders", data: jsonQuery.recordset },
      });
  });

  const getCustomerCompletedOrderLines = asyncErrorWrapper(async (req, res) => {
    const { document_no } = req.params;
    let query = Get_Customer_Completed_Order_Lines;
    if (req.auth.customerno)
      query += " where [documentno] ='" + document_no + "'";
    const jsonQuery = await DBCommands.runQuery(query);
    const token = generateJwtFromUser(req.auth.customerno, req.auth.email);
    const { NODE_ENV, JWT_COOKIE } = process.env;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000),
        secure: NODE_ENV === "development" ? false : true,
      })
      .json({
        success: true,
        access_token: token,
        message: { table: "CompletedOrders", data: jsonQuery.recordset },
      });
  });
module.exports = { getCustomerPendingOrders,getCustomerPendingOrderLines,getCustomerCompletedOrders,getCustomerCompletedOrderLines};
