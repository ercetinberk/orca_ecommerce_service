const CustomError = require("../../helpers/error/CustomError")
const jwt = require("jsonwebtoken")
const {isTokenIncluded,getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers")
const getAccessToRoute=(req,res,next) => {
    //401(Unauthorization),403(Forbidden)
    const {JWT_SECRET_KEY}=process.env
    if (!isTokenIncluded(req))
        return next(new CustomError("You are not access route",401))
    const accessToken = getAccessTokenFromHeader(req)
    jwt.verify(accessToken,JWT_SECRET_KEY,(err,decoded)=>{
        if(err)
            return next(new CustomError("You are not authorization to access this route",401))
        
        req.auth={
            customerno:decoded.id,
            email:decoded.name
        }
        next();
    })
}
module.exports={getAccessToRoute}