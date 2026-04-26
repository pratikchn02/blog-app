const { verifyJWT } = require("../utils/generateToken")

const verifyUser = async(req  , res ,next) =>{
    try {
    let token = req.headers.authorization.split(" ")[1]    
     if(!token){
        return res.status(400).json({
            success : false,
            message : "Please signIn"
        })
    }
    try {
        let user = await verifyJWT(token)
        if(!user){
            return res.status(400).json({
            success : false,
            message : "Please signIn"
        })
        }
         req.user = user.id
        next()
    } catch (error) {
        
    }
    } catch (error) {
        return res.status(400).json({
            success : false,
            message : "Please signIn"
        })
    }
    
    
   
    
    // next()
}
module.exports = verifyUser