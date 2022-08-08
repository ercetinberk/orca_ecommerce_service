const jwt = require("jsonwebtoken")

const sentJwtToClient = (user,res)=>{
    //GENERATE JWT
    const token= generateJwtFromUser(user.customerno,user.email)
    const {NODE_ENV,JWT_COOKIE}=process.env
    return res
            .status(200)
            .cookie("access_token",token,{
                httpOnly:true,
                expires: new Date(Date.now()+parseInt(JWT_COOKIE)*1000),
                secure : NODE_ENV === "development" ? false : true
            })
            .json({
                success:true,
                access_token:token,
                data:user
                
            })
    //RESPONSE
}
const generateJwtFromUser=(id,name)=>{
    const {JWT_SECRET_KEY,JWT_EXPIRE}=process.env
    const payload = {
        id:id,
        name:name
    }
    const token = jwt.sign(payload,JWT_SECRET_KEY,{expiresIn:JWT_EXPIRE})
    return token;
}
const isTokenIncluded = (req)=> {
    return req.headers.authorization && req.headers.authorization.startsWith('Bearer:');
}
const getAccessTokenFromHeader = (req)=> {
    const authorization = req.headers.authorization
    const accessToken = authorization.split(" ")[1]
    return accessToken
}


module.exports={sentJwtToClient,isTokenIncluded,getAccessTokenFromHeader,generateJwtFromUser}