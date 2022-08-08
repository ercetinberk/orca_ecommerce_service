//Products Queries
const Get_All_Products = "SELECT [itemno],[brandname],[countryname],[description],[packsize],[salesunit],[searchdescription],[stockqty],ISNULL((select top 1 unitprice from Orca$oec_sales_price as sp where sp.salescode='@customerpricegroup' and sp.itemno=item.itemno),item.unitprice) as  [unitprice],[unitsize],[vat],[itemcategory],[productgroup],[newitem],[minimumsellingprice],[description2],[actualcost],[weboffer],[image],[unitprice] as itemprice FROM [dbo].[Orca$oec_item] as item "
const Get_Data_Count="SELECT COUNT(id) as dataCount from Orca$oec_item "
const Get_Card_Product = "SELECT [itemno],[brandname],[countryname],[description],[packsize],[salesunit],[searchdescription],[stockqty],ISNULL((select top 1 unitprice from Orca$oec_sales_price as sp where sp.salescode='@customerpricegroup' and sp.itemno=item.itemno),item.unitprice) as  [unitprice],[unitsize],[vat],[itemcategory],[productgroup],[newitem],[minimumsellingprice],[description2],[actualcost],[weboffer],[image],[unitprice] as itemprice FROM [dbo].[Orca$oec_item] as item where itemno='@itemno'"

//Category Queries
const Get_All_Categories="SELECT [indentation],[description],[code],[parentcode] FROM [Orca$oec_category]"
const Get_Selected_Product_Group_Name="SELECT cat.category_id as CategoryId, cat.parent_id as ParentId, cat.image as Image, cat.top as Top, des.name as Name from oc_category as cat INNER JOIN oc_category_description des ON cat.category_id = des.category_id where cat.parent_id=@parent_id limit 2"
//Sttings Queries
const Get_All_Settings="SELECT * FROM [Orca$oec_settings]"
//Banner Queries
const Get_All_Banner_Images="SELECT [id],[bannercode],[bannertype],[title],[link],[sortorder],(select top 1 [status] from Orca$oec_banner where bannercode=bannercode) as [name] FROM [6302_Orca_E_Commerce].[dbo].[Orca$oec_banner_image]"
//Cart Queries
const Get_All_Cart_Items="SELECT  [id],[itemno],[selltocustomerno],[description],[itemunit],[lineamount],[lineamountinclvat],[unitprice],[quantity],(select top 1 [image] from Orca$oec_item where itemno=cart.itemno) as [image],(select top 1 stockqty from Orca$oec_item where itemno=cart.itemno) as stockqty,[deliverymethod] FROM [Orca$oec_cart] as cart"
const Insert_Product_To_Cart="INSERT INTO [dbo].[Orca$oec_cart] ([createdAt],[updatedAt],[itemno],[selltocustomerno],[description],[itemunit],[lineamount],[lineamountinclvat],[unitprice],[quantity],[deliverymethod]) VALUES ( getdate() , getdate() , @itemno , @selltocustomerno , @description , @itemunit , @lineamount , @lineamountinclvat , @unitprice , @quantity, @deliverymethod )"
const Update_Cart_Product="UPDATE [Orca$oec_cart] SET [lineamount] = @lineamount ,[lineamountinclvat] = @lineamountinclvat ,[quantity] = @quantity WHERE [itemno]= @itemno and [selltocustomerno]= @selltocustomerno "
const Remove_From_Cart="DELETE FROM [Orca$oec_cart] WHERE id= '@id'"
const Remove_From_Cart_For_Product="DELETE FROM [Orca$oec_cart] WHERE itemno= @itemno and selltocustomerno=@selltocustomerno"
const Insert_Sales_Header="INSERT INTO [dbo].[Orca$oec_sales_header]([createdAt],[updatedAt],[requesteddeliverydate],[orderdate],[ready],[deliverymethod],[selltocustomerno],[selltocustomeraddress]) VALUES (GETDATE(),GETDATE(),GETDATE(),GETDATE(),0,@deliverymethod,@selltocustomerno ,@selltocustomeraddress) select * from [dbo].[Orca$oec_sales_header] where id=(select SCOPE_IDENTITY())"
const Insert_Sales_Line="INSERT INTO [dbo].[Orca$oec_sales_line] ([createdAt],[updatedAt],[documentno],[itemno],[itemname],[itemunit],[quantity] ,[itemunitprice] ,[lineamount],[lineamountinclvat],[lineno],[orderdate])  VALUES (GETDATE(),GETDATE(),@documentno,@itemno,@itemname,@itemunit,@quantity,@itemunitprice,@lineamount,@lineamountinclvat,@lineno,GETDATE())"
const Delete_Sales_Header="Delete from [dbo].[Orca$oec_sales_header] "
const Delete_Sales_Line="Delete from [dbo].[Orca$oec_sales_line] "
const Delete_Cart_Products="DELETE FROM [Orca$oec_cart] "
const Update_Delivery_Method_Customer_Cart="UPDATE [Orca$oec_cart] SET deliverymethod = '@deliverymethod' "
//User Customers
const Get_All_Customers="SELECT * FROM dbo.Orca$oec_customer"
const Insert_Customer_Address="INSERT INTO [dbo].[Orca$oec_address] ([id],[createdAt],[updatedAt],[customerid],[company],[address1],[address2],[city],[postcode],[countryid] ,[zoneid]) OUTPUT Inserted.id VALUES (NEWID(),GETDATE(),GETDATE(),'@customerid','@company','@address','@address2','@city','@postcode',@countryid,@zoneid)"
const Insert_Customer="INSERT INTO [dbo].[Orca$oec_customer] ([id],[createdAt],[updatedAt],[customerno],[email],[firstname],[lastname],[telephone],[fax],[password],[salt],[newsletter],[status],[synced],[customerpricegroup]) OUTPUT Inserted.id VALUES(NEWID(),GETDATE(),GETDATE(),'','@email','@firstname','@lastname','@telephone','','@password','@salt',0,0,0,'')"
const Get_New_Customer = "select * FROM dbo.Orca$oec_customer "
const Get_Customer_Addresses="SELECT  company + ',' + address1 + ',' + city + ',' + postcode as [value] FROM Orca$oec_address "
const Update_User="UPDATE [Orca$oec_customer] SET [firstname] = '@firstname' ,[lastname] = '@lastname' ,[telephone] = '@telephone' ,[email] = '@email' WHERE [id]= '@id'"
const Update_Password="UPDATE [Orca$oec_customer] SET [password] = '@password' ,[salt] = '@salt'  WHERE [id]= '@id'"
const Update_DeliveryMethod="UPDATE [Orca$oec_customer] SET [deliverymethod] = '@deliverymethod'  WHERE [id]= '@id'"

//Manufacturer Queries
const Get_All_Manufacturer="SELECT[id],[code],[name] FROM [6302_Orca_E_Commerce].[dbo].[Orca$oec_manufacturer]"

//Order Queries
const Get_Customer_Pending_Orders = "SELECT [documentno],[requesteddeliverydate],[orderdate],[deliverymethod],[selltocustomerno],(select c.firstname+' '+c.lastname  from Orca$oec_customer as c where c.customerno=[selltocustomerno]) as customername,[selltocustomeraddress],(Select SUM([lineamountinclvat]) as amount from Orca$oec_sales_line where [documentno]=header.[documentno] ) as amount FROM [6302_Orca_E_Commerce].[dbo].[Orca$oec_sales_header] as header"
const Get_Customer_Pending_Order_Lines ="SELECT [documentno],[itemno],[itemname],[itemunit],[quantity],[itemunitprice],[lineamount],[lineamountinclvat],[lineno],[orderdate] FROM [6302_Orca_E_Commerce].[dbo].[Orca$oec_sales_line]"
const Get_Customer_Completed_Orders = "SELECT [documentno],[requesteddeliverydate],[orderdate],[deliverymethod],[selltocustomerno],(select c.firstname+' '+c.lastname  from Orca$oec_customer as c where c.customerno=[selltocustomerno]) as customername,[selltocustomeraddress],(Select SUM([lineamountinclvat]) as amount from Orca$oec_sales_invoice_line where [documentno]=header.[documentno] ) as amount FROM [6302_Orca_E_Commerce].[dbo].[Orca$oec_sales_invoice_header] as header"
const Get_Customer_Completed_Order_Lines ="SELECT [documentno],[itemno],[itemname],[itemunit],[quantity],[itemunitprice],[lineamount],[lineamountinclvat],[lineno],[orderdate] FROM [6302_Orca_E_Commerce].[dbo].[Orca$oec_sales_invoice_line]"
const Update_Header_Ready_Status="UPDATE [Orca$oec_sales_header] SET [ready] = 1 "

//Region Queries
const Get_All_Region="SELECT[id],[code],[name] FROM [6302_Orca_E_Commerce].[dbo].[Orca$oec_region]"
module.exports={
    Get_All_Products,
    Get_All_Categories,
    Get_All_Banner_Images,
    Get_All_Cart_Items,
    Insert_Product_To_Cart,
    Update_Cart_Product,
    Remove_From_Cart,
    Get_All_Customers,
    Get_Data_Count,
    Remove_From_Cart_For_Product,
    Insert_Customer_Address,Insert_Customer,Get_New_Customer,Get_All_Settings,
    Get_All_Manufacturer,
    Get_Customer_Addresses,
    Insert_Sales_Header,
    Insert_Sales_Line,Delete_Sales_Header,Delete_Sales_Line,Delete_Cart_Products,
    Get_Customer_Pending_Orders,Get_Customer_Pending_Order_Lines,
    Update_User,Update_Password,Get_All_Region,
    Update_Header_Ready_Status,
    Get_Customer_Completed_Orders,Get_Customer_Completed_Order_Lines,
    Update_Delivery_Method_Customer_Cart,
    Get_Card_Product
}