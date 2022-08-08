const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { sentJwtToClient,generateJwtFromUser } = require("../helpers/authorization/tokenHelpers");
const DBCommands = require("../helpers/database/dbCommands");
const { Get_All_Customers,Insert_Customer,Insert_Customer_Address ,Get_New_Customer,Get_Customer_Addresses,Update_User,Update_Password,Update_DeliveryMethod} = require("../helpers/database/databaseQueries");
const {
  validateUserInput,
  comparePassword,
} = require("../helpers/input/inputHelpers");
const bcryptjs = require("bcryptjs");

const login = asyncErrorWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!validateUserInput(email, password))
    return next(new CustomError("Please check your input !", 400));
  const jsonQuery = await DBCommands.runQuery(Get_All_Customers);
  const user = jsonQuery.recordset.find((x) => x.email === email);
  if (!user) return next(new CustomError("Warning: No match for E-Mail Address and/or Password.", 400));
  else if(!user.status)return next(new CustomError("Warning: Your account requires approval before you can login.", 400));
  if (!comparePassword(password, user.password))
    return next(new CustomError("Warning: No match for E-Mail Address and/or Password.", 400));
  const jsonQueryAddressList = await DBCommands.runQuery(Get_Customer_Addresses+`where customerid = '${user.id}'`);
  user.adrressList=jsonQueryAddressList.recordset
  sentJwtToClient(user, res);
});

const register = asyncErrorWrapper(async (req, res, next) => {
  const { address, address2, city, companyname, country, email, firstname, lastname, password, postcode, telephone } = req.body;
  if (!validateUserInput(email, password))
    return next(new CustomError("Please check your input !", 400));

  const jsonQuery = await DBCommands.runQuery(Get_All_Customers);
  const user = jsonQuery.recordset.find((x) => x.email === email);
  if (user) return next(new CustomError("Warning: E-Mail Address is already registered!", 400));

  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(password, salt);
  
  let insertCustomerQuery=Insert_Customer
  insertCustomerQuery = insertCustomerQuery.replace("@email", email );
  insertCustomerQuery = insertCustomerQuery.replace("@firstname", firstname );
  insertCustomerQuery = insertCustomerQuery.replace("@lastname", lastname );
  insertCustomerQuery = insertCustomerQuery.replace("@telephone", telephone );
  insertCustomerQuery = insertCustomerQuery.replace("@password", hash );
  insertCustomerQuery = insertCustomerQuery.replace("@salt", salt );

  const jsonQueryInsertCustomer = await DBCommands.runQuery(insertCustomerQuery);
  const newCustomerId = jsonQueryInsertCustomer.recordset[0].id
 
  let insertCustomerAddressQuery=Insert_Customer_Address
  insertCustomerAddressQuery = insertCustomerAddressQuery.replace("@customerid", newCustomerId);
  insertCustomerAddressQuery = insertCustomerAddressQuery.replace("@company", companyname);
  insertCustomerAddressQuery = insertCustomerAddressQuery.replace("@address", address);
  insertCustomerAddressQuery = insertCustomerAddressQuery.replace("@address2",address2);
  insertCustomerAddressQuery = insertCustomerAddressQuery.replace("@city",city);
  insertCustomerAddressQuery = insertCustomerAddressQuery.replace("@postcode",postcode );
  insertCustomerAddressQuery = insertCustomerAddressQuery.replace("@countryid",0 );
  insertCustomerAddressQuery = insertCustomerAddressQuery.replace("@zoneid",222 );

  await DBCommands.runQuery(insertCustomerAddressQuery);
  const jsonQueryNewCustomer = await DBCommands.runQuery(Get_New_Customer+`where id = '${newCustomerId}'`);
  const newUser=jsonQueryNewCustomer.recordset[0]
  const jsonQueryAddressList = await DBCommands.runQuery(Get_Customer_Addresses+`where customerid = '${newCustomerId}'`);
  newUser.adrressList=jsonQueryAddressList.recordset
  res.status(200).json({
    success: true,
    data: newUser,
  });
});
const logout = asyncErrorWrapper(async (req, res, next) => {
  const { NODE_ENV } = process.env;
  res
    .status(200)
    .cookie({
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: true,
      message:"logout successful"
    });
});
const getUser = async (req, res, next) => {
  const jsonQuery = await DBCommands.runQuery(Get_All_Customers);
  const user = jsonQuery.recordset.find((x) => x.email === req.auth.email);
  const jsonQueryAddressList = await DBCommands.runQuery(Get_Customer_Addresses+`where customerid = '${user.id}'`);
  user.adrressList=jsonQueryAddressList.recordset
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
      data:user,
    });
};
const updateUser = asyncErrorWrapper(async (req, res, next) => {
  const { id, email, firstname, lastname, telephone } = req.body;

  let status=false
  let message =""
  let query=Update_User
  
  query = query.replace("@firstname", firstname );
  query = query.replace("@lastname", lastname );
  query = query.replace("@telephone", telephone );
  query = query.replace("@email", email );
  query = query.replace("@id", id );
  try {
    await DBCommands.runQuery(query);
    status= true
    message = "sucess"
  } catch (error) {
    message=error
  }
  res.status(200).json({
    success: status,
    message : message
  });
});
const updatePassword = asyncErrorWrapper(async (req, res, next) => {
  const { id, password } = req.body;

  let status=false
  let message =""
  let query=Update_Password
  const salt = bcryptjs.genSaltSync(10);
  const hash = bcryptjs.hashSync(password, salt);

  query = query.replace("@salt", salt );
  query = query.replace("@password", hash );
  query = query.replace("@id", id );
  try {
    await DBCommands.runQuery(query);
    status= true
    message = "sucess"
  } catch (error) {
    message=error
  }
  res.status(200).json({
    success: status,
    message : message
  });
});
const updateDeliveryMethod = asyncErrorWrapper(async (req, res, next) => {
  const { id, deliverymethod } = req.body;
  let query=Update_DeliveryMethod

  query = query.replace("@deliverymethod", deliverymethod );
  query = query.replace("@id", id );
  try {
    await DBCommands.runQuery(query);
    const jsonQuery = await DBCommands.runQuery(Get_All_Customers);
    const user = jsonQuery.recordset.find((x) => x.email === req.auth.email);
    const jsonQueryAddressList = await DBCommands.runQuery(Get_Customer_Addresses+`where customerid = '${user.id}'`);
    user.adrressList=jsonQueryAddressList.recordset
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
      data:user,
    });
  } catch (error) {
    res
    .status(200)
    .cookie("access_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000),
      secure: NODE_ENV === "development" ? false : true,
    })
    .json({
      success: false,
      access_token: token,
      data:null,
    });
  }
});

//#region Mobile Functions
const getMobileUser = async (req, res) => {
  console.log(req.query);
  if(req.query.id){
    const jsonQuery = await DBCommands.runQuery(Get_All_Customers);
    const user = jsonQuery.recordset.find((x) => x.id === req.query.id);
    const jsonQueryAddressList = await DBCommands.runQuery(Get_Customer_Addresses+`where customerid = '${user.id}'`);
    user.adrressList=jsonQueryAddressList.recordset
    res
      .status(200)
      .json({
        success: true,
        data:user,
      });
  }else{
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};
//#endregion
module.exports={login,register,logout,getUser,updateUser,updatePassword,getMobileUser}