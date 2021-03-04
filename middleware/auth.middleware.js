const jwt = require('jsonwebtoken')
const config = require('config')
module.exports = (req,res,next)=> {
    if ( req.method === 'OPTIONS'){
        return next()
    }
try{
  const token = req.headers.authorization.split(' ')[1]  //Bearer
    if(!token){
        res.status(401).json({message:'нет авторизации '})
    }
    const decoder = jwt.verify(token,config.get('jwtSecret'))
    req.user = decoder
    next()
    }
    catch (e) {
        res.status(401).json({message:'нет авторизации '})

    }
}
