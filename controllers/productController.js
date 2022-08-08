const asyncErrorWrapper = require("express-async-handler");
const DBCommands = require("../helpers/database/dbCommands");
const {
  Get_All_Products,
  Get_Data_Count,
  Get_Card_Product,
  Get_All_Customers
} = require("../helpers/database/databaseQueries");

const getProducts = asyncErrorWrapper(async (req, res) => {  
  let rL = [];
  let count = 0;
  let query = Get_All_Products;
  let dataCountQuery = Get_Data_Count;
  let filterString=""
  if(req.query.filter){
    let filterKeys=req.query.filter.split(" ")
    filterKeys.map((key,index)=>{
      filterString+=`[description] like '%${key}%' `
      if(index+1 < filterKeys.length )
        filterString+='and '
    })
  }
  
  if(req.query.itemcategory ||req.query.productgroup ||req.query.filter ||req.query.brand ||req.query.country)
  {
    query += 'where '
    dataCountQuery += 'where '
  }
  //` [description] like '%${req.query.filter}%' `

  query+= `${req.query.filter ? (req.query.filter==='weboffers' ? ` weboffer >0 ` : filterString ) : ''}`+
          `${req.query.itemcategory ? `${(req.query.filter) ? 'and ':''} itemcategory='${req.query.itemcategory}' ` : ''}`+
          `${req.query.productgroup ? `${(req.query.filter || req.query.itemcategory) ? 'and ':''} productgroup='${req.query.productgroup}' ` : ''}`+
          `${req.query.brand ? `${(req.query.filter || req.query.itemcategory || req.query.productgroup) ? 'and ':''} brandname='${req.query.brand}' ` : ''}`+
          `${req.query.country ? `${(req.query.filter || req.query.itemcategory || req.query.productgroup || req.query.brand )? 'and ':''} countryname='${req.query.country}'` : ''}`+
          ` order by sortorder `
  dataCountQuery+= `${req.query.filter ? (req.query.filter==='weboffers' ? ` weboffer >0 ` : filterString) : ''}`+
                  `${req.query.itemcategory ? `${(req.query.filter) ? 'and ':''} itemcategory='${req.query.itemcategory}' ` : ''}`+
                  `${req.query.productgroup ? `${(req.query.filter || req.query.itemcategory) ? 'and ':''} productgroup='${req.query.productgroup}' ` : ''}`+
                  `${req.query.brand ? `${(req.query.filter || req.query.itemcategory || req.query.productgroup) ? 'and ':''} brandname='${req.query.brand}' ` : ''}`+
                  `${req.query.country ? `${(req.query.filter || req.query.itemcategory || req.query.productgroup || req.query.brand )? 'and ':''} countryname='${req.query.country}'` : ''}`
  if (req.query.page && req.query.rowsPerPage)
    query+=` OFFSET ${req.query.page * req.query.rowsPerPage} ROWS FETCH NEXT ${req.query.rowsPerPage} ROWS ONLY`
  if(req.query.customerprice)
    query= query.replace("@customerpricegroup", req.query.customerprice );
  //Mobile Control
  if(req.query.customerId){
    const jsonQuery = await DBCommands.runQuery(Get_All_Customers);
    const user = jsonQuery.recordset.find((x) => x.id === req.query.customerId);
    query= query.replace("@customerpricegroup", user.customerpricegroup );
  }
  //Mobile Control

  console.log(query);
  const jsonQuery = await DBCommands.runQuery(query);
  const dataCount = await DBCommands.runQuery(dataCountQuery);
  rL = jsonQuery.recordset;
  count = parseInt(dataCount.recordset[0].dataCount);
  /*
  if (req.query.filter) {
    let query = Get_All_Products;
    let dataCountQuery = Get_Data_Count;
    if (req.query.page && req.query.rowsPerPage)
      query += `where [description] like '%${req.query.filter}%' ${req.query.brand ? ` and brandname='${req.query.brand}'` : ''} ${req.query.country ? ` and countryname='${req.query.country}'` : ''} order by sortorder  OFFSET ${req.query.page * req.query.rowsPerPage} ROWS FETCH NEXT ${req.query.rowsPerPage} ROWS ONLY`;
    else
      query += `where [description] like '%${req.query.filter}%' ${req.query.brand ? ` and brandname='${req.query.brand}'` : ''} ${req.query.country ? ` and countryname='${req.query.country}'` : ''} order by sortorder `;
    
    dataCountQuery += `where [description] like '%${req.query.filter}%' ${req.query.brand ? ` and brandname='${req.query.brand}'` : ''} ${req.query.country ? ` and countryname='${req.query.country}'` : ''}`;

    if(req.query.customerprice)
      query= query.replace("@customerpricegroup", req.query.customerprice );
    console.log(query);
    const jsonQuery = await DBCommands.runQuery(query);
    const dataCount = await DBCommands.runQuery(dataCountQuery);
    rL = jsonQuery.recordset;
    count = parseInt(dataCount.recordset[0].dataCount);
  } else {
    let query = Get_All_Products;
    let dataCountQuery = Get_Data_Count;
    if (req.query.productgroup) {
      query += ` where productgroup = '${
        req.query.productgroup
      }' ${req.query.brand ? ` and brandname='${req.query.brand}'` : ''}  ${req.query.country ? ` and countryname='${req.query.country}'` : ''} order by sortorder  OFFSET ${
        req.query.page * req.query.rowsPerPage
      } ROWS FETCH NEXT ${req.query.rowsPerPage} ROWS ONLY`;
      dataCountQuery += ` where productgroup = '${req.query.productgroup}' ${req.query.brand ? ` and brandname='${req.query.brand}'` : ''} ${req.query.country ? ` and countryname='${req.query.country}'` : ''} `;
    } else if (req.query.itemcategory) {
      query += ` where itemcategory = '${
        req.query.itemcategory
      }' ${req.query.brand ? ` and brandname='${req.query.brand}'` : ''} ${req.query.country ? ` and countryname='${req.query.country}'` : ''} order by sortorder  OFFSET ${
        req.query.page * req.query.rowsPerPage
      } ROWS FETCH NEXT ${req.query.rowsPerPage} ROWS ONLY`;
      dataCountQuery += ` where itemcategory = '${req.query.itemcategory}' ${req.query.brand ? ` and brandname='${req.query.brand}'` : ''} ${req.query.country ? ` and countryname='${req.query.country}'` : ''} `;
    } else {
      if (req.query.page && req.query.rowsPerPage) {
        query += `${req.query.country ? ` where countryname='${req.query.country}'` : ''} order by sortorder  OFFSET ${
          req.query.page * req.query.rowsPerPage
        } ROWS FETCH NEXT ${req.query.rowsPerPage} ROWS ONLY`;
      }
    }
    if(req.query.customerprice)
      query= query.replace("@customerpricegroup", req.query.customerprice );
    console.log("1 : "+query);
    const jsonQuery = await DBCommands.runQuery(query);
    const dataCount = await DBCommands.runQuery(dataCountQuery);
    rL = jsonQuery.recordset;
    count = parseInt(dataCount.recordset[0].dataCount);
  }
  */
  res.status(200).json({
    status: "success",
    message: { table: "Item", data: rL, dataCount: count },
  });
});
const getWebOfferProducts = asyncErrorWrapper(async (req, res) => {  
  let rL = [];
  let count = 0;
  let query = Get_All_Products;
  let dataCountQuery = Get_Data_Count;

  query += ' where weboffer > 0 '
  dataCountQuery += ' where weboffer > 0  '
  if(req.query.customerprice)
    query= query.replace("@customerpricegroup", req.query.customerprice );
  if(req.query.customerId){
    const jsonQuery = await DBCommands.runQuery(Get_All_Customers);
    const user = jsonQuery.recordset.find((x) => x.id === req.query.customerId);
    query= query.replace("@customerpricegroup", user.customerpricegroup );
  }
    


  const jsonQuery = await DBCommands.runQuery(query);
  const dataCount = await DBCommands.runQuery(dataCountQuery);
  rL = jsonQuery.recordset.length > 10 ?jsonQuery.recordset.slice(0,10) : jsonQuery.recordset ;
  count = parseInt(dataCount.recordset[0].dataCount) > 10 ?  10 : parseInt(dataCount.recordset[0].dataCount) ;
  res.status(200).json({
    status: "success",
    message: { table: "Item", data: rL, dataCount: count },
  });
});
const getCardProduct = asyncErrorWrapper(async (req, res) => {  
  const { item_no } = req.params;
  let query = Get_Card_Product;
  query = query.replace("@itemno", item_no);
  const jsonQuery = await DBCommands.runQuery(query);
  res.status(200).json({
    status: "success",
    message: { table: "Item", data: jsonQuery.recordset , dataCount: 1 },
  });
});
const getSearchProducts = asyncErrorWrapper(async (req, res) => {  
  console.log('berk');
  let rL = [];
  let count = 0;
  let query = Get_All_Products;
  let dataCountQuery = Get_Data_Count;
  let filterString=""
  console.log(req.query.filter);
  if(req.query.filter){
    let filterKeys=req.query.filter.split(" ")
    filterKeys.map((key,index)=>{
      filterString+=`[description] like '%${key}%' `
      if(index+1 < filterKeys.length )
        filterString+='and '
    })
  }
  
  if(req.query.filter)
  {
    query += 'where '
    dataCountQuery += 'where '
  }

  query+= `${req.query.filter ?  filterString  : ''}`+
          ` order by sortorder `
  dataCountQuery+= `${req.query.filter ?  filterString  : ''}`
  query+=` OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY`

  console.log(query);
  const jsonQuery = await DBCommands.runQuery(query);
  const dataCount = await DBCommands.runQuery(dataCountQuery);
  rL = jsonQuery.recordset;
  count = parseInt(dataCount.recordset[0].dataCount);
  
  res.status(200).json({
    status: "success",
    message: { table: "Item", data: rL, dataCount: count },
  });
});

module.exports = { getProducts,getWebOfferProducts,getCardProduct,getSearchProducts };
