const jwt = require("jsonwebtoken")

async function generateJWT(payload){
    let token = await jwt.sign(payload , "jngjofnjoasngposngosao"  )
    return token
}
async function verifyJWT(token){
    try {
        let data = await jwt.verify(token , "jngjofnjoasngposngosao"  )
        return data
    } catch (err) {
        return false
    }
    
}
async function decodeJWT(token){ 
    let decoded =  await jwt.decode(token,  {})
    return decoded
}
module.exports = {generateJWT , verifyJWT ,decodeJWT}