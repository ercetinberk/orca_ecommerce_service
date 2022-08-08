const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const DBCommands = require("../helpers/database/dbCommands");
const {
  generateJwtFromUser,
} = require("../helpers/authorization/tokenHelpers");
const {
  Get_All_Cart_Items,
  Remove_From_Cart,
  Insert_Product_To_Cart,
  Update_Cart_Product,
  Remove_From_Cart_For_Product,
  Insert_Sales_Header,
  Insert_Sales_Line,
  Delete_Sales_Header,Delete_Sales_Line,Delete_Cart_Products,
  Update_Header_Ready_Status,
  Update_Delivery_Method_Customer_Cart,
  Get_All_Customers
} = require("../helpers/database/databaseQueries");
const getAllCartProducts = asyncErrorWrapper(async (req, res) => {
  let query = Get_All_Cart_Items;
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
      message: { table: "Cart", data: jsonQuery.recordset },
    });
});
const addToCart = asyncErrorWrapper(async (req, res) => {
  console.log(req.body);
  if (req.body.quantity === 0) {
    let query = Remove_From_Cart_For_Product;
    query = query.replace("@itemno", "'" + req.body.product.itemno + "'");
    query = query.replace("@selltocustomerno", "'" + req.auth.customerno + "'");
    const jsonQuery = await DBCommands.runQuery(query);

    /*
    res.status(200).json({
      status: "success",
      message: "updated item",
    });
    */
  } else {
    const jsonQuery = await DBCommands.runQuery(Get_All_Cart_Items);
    const currentCartList = jsonQuery.recordset;
    const adedItem = currentCartList.find(
      (item) =>
        item.itemno === req.body.product.itemno &&
        item.selltocustomerno === req.auth.customerno
    );
    if (adedItem) {
      let query = Update_Cart_Product;
      query = query.replace("@itemno", "'" + adedItem.itemno + "'");
      query = query.replace(
        "@selltocustomerno",
        "'" + req.auth.customerno + "'"
      );
      query = query.replace(
        "@lineamount",
        (adedItem.unitprice * (adedItem.quantity + req.body.quantity))
          .toFixed(2)
          .toString()
      );
      query = query.replace(
        "@lineamountinclvat",
        (
          (adedItem.unitprice +
            (adedItem.unitprice * req.body.product.vat) / 100) *
          (adedItem.quantity + req.body.quantity)
        )
          .toFixed(2)
          .toString()
      );
      query = query.replace(
        "@quantity",
        (adedItem.quantity + req.body.quantity).toFixed(2).toString()
      );
      const jsonQuery = await DBCommands.runQuery(query);
      /*
      res.status(200).json({
        status: "success",
        message: "updated item",
      });
      */
    } else {
      let query = Insert_Product_To_Cart;
      query = query.replace("@itemno", "'" + req.body.product.itemno + "'");
      query = query.replace(
        "@selltocustomerno",
        "'" + req.auth.customerno + "'"
      );
      query = query.replace(
        "@description",
        "'" + req.body.product.description + "'"
      );
      query = query.replace(
        "@itemunit",
        "'" + req.body.product.salesunit + "'"
      );
      query = query.replace(
        "@lineamount",
        (req.body.product.unitprice * req.body.quantity).toFixed(2).toString()
      );
      query = query.replace(
        "@lineamountinclvat",
        (
          (req.body.product.unitprice +
            (req.body.product.unitprice * req.body.product.vat) / 100) *
          req.body.quantity
        )
          .toFixed(2)
          .toString()
      );
      query = query.replace(
        "@unitprice",
        req.body.product.unitprice.toFixed(2).toString()
      );
      query = query.replace(
        "@quantity",
        req.body.quantity.toFixed(2).toString()
      );
      query = query.replace(
        "@deliverymethod",
        "'" + req.body.deliveryMethod + "'"
      );
      console.log(query);
      const jsonQuery = await DBCommands.runQuery(query);
      /*
      res.status(200).json({
        status: "success",
        message: "inserted new item",
      });
      */
    }
  }

  //#region  GET ALL ITEMS
  let queryAllItems = Get_All_Cart_Items;
  if (req.auth.customerno)
    queryAllItems += " where [selltocustomerno] ='" + req.auth.customerno + "'";

  const jsonQueryAllItems = await DBCommands.runQuery(queryAllItems);
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
      message: { table: "Cart", data: jsonQueryAllItems.recordset },
    });
  //#endregion
});
const updateCartProduct = asyncErrorWrapper(async (req, res) => {
  const cartItem = req.body.cartItem
  const processQuntity = req.body.quantity
  let query = Update_Cart_Product;
  query = query.replace("@itemno", "'" + cartItem.itemno + "'");
  query = query.replace("@selltocustomerno", "'" + req.auth.customerno + "'");
  query = query.replace("@lineamount",((cartItem.lineamount/cartItem.quantity)*(processQuntity)).toFixed(2).toString());
  query = query.replace("@lineamountinclvat",((cartItem.lineamountinclvat/cartItem.quantity)*(processQuntity)).toFixed(2).toString());
  //query = query.replace("@quantity", (cartItem.quantity+processQuntity).toFixed(2).toString());
  query = query.replace("@quantity", (processQuntity).toFixed(2).toString());
  const jsonQuery = await DBCommands.runQuery(query);

  //#region  GET ALL ITEMS
  let queryAllItems = Get_All_Cart_Items;
  if (req.auth.customerno)
    queryAllItems += " where [selltocustomerno] ='" + req.auth.customerno + "'";

  const jsonQueryAllItems = await DBCommands.runQuery(queryAllItems);
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
      message: { table: "Cart", data: jsonQueryAllItems.recordset },
    });
  //#endregion
});
const removeFromCart = asyncErrorWrapper(async (req, res) => {
  const { cart_id } = req.params;
  let query = Remove_From_Cart;
  query = query.replace("@id", cart_id);
  const jsonQuery = await DBCommands.runQuery(query);
  //#region  GET ALL ITEMS
  let queryAllItems = Get_All_Cart_Items;
  if (req.auth.customerno)
    queryAllItems += " where [selltocustomerno] ='" + req.auth.customerno + "'";

  const jsonQueryAllItems = await DBCommands.runQuery(queryAllItems);
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
      message: { table: "Cart", data: jsonQueryAllItems.recordset },
    });
  //#endregion
});

const checkoutCart = asyncErrorWrapper(async (req, res, next) => {
  //#region CHECKOUT
  let querySalesHeader = Insert_Sales_Header;
  querySalesHeader = querySalesHeader.replace("@deliverymethod", `'${req.body.deliveryMethod}'`);
  querySalesHeader = querySalesHeader.replace("@selltocustomerno", `'${req.body.customerno}'`);
  querySalesHeader = querySalesHeader.replace("@selltocustomeraddress", `'${req.body.address}'`);
  const jsonQuerySalesHeader = await DBCommands.runQuery(querySalesHeader);
  //get cart products
  let query = Get_All_Cart_Items;
  if (req.auth.customerno)
    query += " where [selltocustomerno] ='" + req.body.customerno + "'";

  const cartProducts = await DBCommands.runQuery(query);
  //
  let index=0
  let queryError=''
  for(const product of cartProducts.recordset){
    index++
    let querySalesLine = Insert_Sales_Line;
    querySalesLine = querySalesLine.replace("@documentno", `'${jsonQuerySalesHeader.recordset[0].documentno}'`);
    querySalesLine = querySalesLine.replace("@itemno", `'${product.itemno}'`);
    querySalesLine = querySalesLine.replace("@itemname", `'${product.description}'`);
    querySalesLine = querySalesLine.replace("@itemunit", `'${product.itemunit}'`);
    querySalesLine = querySalesLine.replace("@quantity", `${product.quantity}`);
    querySalesLine = querySalesLine.replace("@itemunitprice", `${product.unitprice}`);
    querySalesLine = querySalesLine.replace("@lineamount", `${product.lineamount}`);
    querySalesLine = querySalesLine.replace("@lineamountinclvat", `${product.lineamountinclvat}`);
    querySalesLine = querySalesLine.replace("@lineno", `${((index)*1000)}`);
    //querySalesLine = querySalesLine.replace("@orderdate", `'${jsonQuerySalesHeader.recordset[0].orderdate}'`);
    try {
      await DBCommands.runQuery(querySalesLine);
    } catch (error) {
      queryError=error
      await DBCommands.runQuery(Delete_Sales_Header+`where id=${jsonQuerySalesHeader.recordset[0].id}`);
      await DBCommands.runQuery(Delete_Sales_Line+`where documentno='${jsonQuerySalesHeader.recordset[0].documentno}'`);
      break
    }
  }
  //#endregion
  //UPDATE TOKEN
  if(queryError!=='')
    return next(new CustomError(queryError, 400));
  else{
    await DBCommands.runQuery(Delete_Cart_Products+`where selltocustomerno='${req.body.customerno}'`);
    await DBCommands.runQuery(Update_Header_Ready_Status+` where documentno='${jsonQuerySalesHeader.recordset[0].documentno}'`);
  }
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
      message: "checkout order suucessful ." ,
    });
  //#endregion
});
const  updateDeliveryMethod = asyncErrorWrapper(async (req, res) => {
  console.log(req.body);
  let query = Update_Delivery_Method_Customer_Cart;
  query = query.replace("@deliverymethod", req.body.deliverymethod);
  console.log(query);
  if (req.auth.customerno)
    query += " where [selltocustomerno] ='" + req.auth.customerno + "'";
  console.log(query); 
  await DBCommands.runQuery(query);
  let queryCartProducts = Get_All_Cart_Items;
  if (req.auth.customerno)
    queryCartProducts += " where [selltocustomerno] ='" + req.auth.customerno + "'";

  const jsonQuery = await DBCommands.runQuery(queryCartProducts);
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
      message: { table: "Cart", data: jsonQuery.recordset },
    });
});


//#region Mobile Functions 
const getAllCartProductsForMobile = asyncErrorWrapper(async (req, res) => {
  let query = Get_All_Cart_Items;
  if(req.query.customerId){
    const jsonQuery = await DBCommands.runQuery(Get_All_Customers);
    const user = jsonQuery.recordset.find((x) => x.id === req.query.customerId);
    query += " where [selltocustomerno] ='" + user.customerno + "'";
  } 

  const jsonQuery = await DBCommands.runQuery(query);
  res
    .status(200)
    .json({
      success: true,
      data: jsonQuery.recordset 
    });
});

const addToCartForMobile = asyncErrorWrapper(async (req, res) => {
  console.log(req.body);
  if (req.body.quantity === 0) {
    let query = Remove_From_Cart_For_Product;
    //Mobile Control
  if(req.query.customerId){
    const jsonQuery = await DBCommands.runQuery(Get_All_Customers);
    const user = jsonQuery.recordset.find((x) => x.id === req.query.customerId);
  }
  //Mobile Control
    query = query.replace("@itemno", "'" + req.body.product.itemno + "'");
    query = query.replace("@selltocustomerno", "'" + req.auth.customerno + "'");
    const jsonQuery = await DBCommands.runQuery(query);

    /*
    res.status(200).json({
      status: "success",
      message: "updated item",
    });
    */
  } else {
    const jsonQuery = await DBCommands.runQuery(Get_All_Cart_Items);
    const currentCartList = jsonQuery.recordset;
    const adedItem = currentCartList.find(
      (item) =>
        item.itemno === req.body.product.itemno &&
        item.selltocustomerno === req.auth.customerno
    );
    if (adedItem) {
      let query = Update_Cart_Product;
      query = query.replace("@itemno", "'" + adedItem.itemno + "'");
      query = query.replace(
        "@selltocustomerno",
        "'" + req.auth.customerno + "'"
      );
      query = query.replace(
        "@lineamount",
        (adedItem.unitprice * (adedItem.quantity + req.body.quantity))
          .toFixed(2)
          .toString()
      );
      query = query.replace(
        "@lineamountinclvat",
        (
          (adedItem.unitprice +
            (adedItem.unitprice * req.body.product.vat) / 100) *
          (adedItem.quantity + req.body.quantity)
        )
          .toFixed(2)
          .toString()
      );
      query = query.replace(
        "@quantity",
        (adedItem.quantity + req.body.quantity).toFixed(2).toString()
      );
      const jsonQuery = await DBCommands.runQuery(query);
      /*
      res.status(200).json({
        status: "success",
        message: "updated item",
      });
      */
    } else {
      let query = Insert_Product_To_Cart;
      query = query.replace("@itemno", "'" + req.body.product.itemno + "'");
      query = query.replace(
        "@selltocustomerno",
        "'" + req.auth.customerno + "'"
      );
      query = query.replace(
        "@description",
        "'" + req.body.product.description + "'"
      );
      query = query.replace(
        "@itemunit",
        "'" + req.body.product.salesunit + "'"
      );
      query = query.replace(
        "@lineamount",
        (req.body.product.unitprice * req.body.quantity).toFixed(2).toString()
      );
      query = query.replace(
        "@lineamountinclvat",
        (
          (req.body.product.unitprice +
            (req.body.product.unitprice * req.body.product.vat) / 100) *
          req.body.quantity
        )
          .toFixed(2)
          .toString()
      );
      query = query.replace(
        "@unitprice",
        req.body.product.unitprice.toFixed(2).toString()
      );
      query = query.replace(
        "@quantity",
        req.body.quantity.toFixed(2).toString()
      );
      query = query.replace(
        "@deliverymethod",
        "'" + req.body.deliveryMethod + "'"
      );
      console.log(query);
      const jsonQuery = await DBCommands.runQuery(query);
      /*
      res.status(200).json({
        status: "success",
        message: "inserted new item",
      });
      */
    }
  }

  //#region  GET ALL ITEMS
  let queryAllItems = Get_All_Cart_Items;
  if (req.auth.customerno)
    queryAllItems += " where [selltocustomerno] ='" + req.auth.customerno + "'";

  const jsonQueryAllItems = await DBCommands.runQuery(queryAllItems);
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
      message: { table: "Cart", data: jsonQueryAllItems.recordset },
    });
  //#endregion
});
//#endregion
module.exports = { getAllCartProducts, addToCart, removeFromCart, updateCartProduct, checkoutCart,updateDeliveryMethod ,getAllCartProductsForMobile};
