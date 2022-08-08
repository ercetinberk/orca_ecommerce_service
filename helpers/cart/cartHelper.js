const insertSalesLine = async (query,cartList,documentNo,orderDate) => {

    await Promise.all(cartList.map((product,index)=>{
        let querySalesLine = Insert_Sales_Line;
        querySalesLine = querySalesLine.replace("@documentno", `'${jsonQuerySalesHeader.recordset[0].documentno}'`);
        querySalesLine = querySalesLine.replace("@itemno", `'${product.itemno}'`);
        querySalesLine = querySalesLine.replace("@itemname", `'${product.description}'`);
        querySalesLine = querySalesLine.replace("@itemunit", `'${product.itemunit}'`);
        querySalesLine = querySalesLine.replace("@quantity", `${product.quantity}`);
        querySalesLine = querySalesLine.replace("@itemunitprice", `${product.unitprice}`);
        querySalesLine = querySalesLine.replace("@lineamount", `${product.lineamount}`);
        querySalesLine = querySalesLine.replace("@lineamountinclvat", `${product.lineamountinclvat}`);
        querySalesLine = querySalesLine.replace("@lineno", `${((index+1)*1000)}`);
        querySalesLine = querySalesLine.replace("@orderdate", `'${jsonQuerySalesHeader.recordset[0].orderdate}'`);
        try {
          await DBCommands.runQuery(querySalesLine);
        } catch (error) {
          let a = Delete_Sales_Header+`where id=${jsonQuerySalesHeader.recordset[0].id}`
          let b = Delete_Sales_Line+`where documentno='${jsonQuerySalesHeader.recordset[0].documentno}'`
          
          //await DBCommands.runQuery();
          //await DBCommands.runQuery();
        }
    }))
};
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};


module.exports = { validateUserInput, comparePassword };
