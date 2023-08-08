var jwt = require('jsonwebtoken');
exports.auth = async (req,res,next)=>{
try{
        let token = req.headers["authorization"].split(" ")[1]
        let decode = jwt.verify( token, process.env.PRIVATEKEY)
        req.user = decode
        next();
    }
    catch(err){
        console.log(err)
        return  res.status(404).send({
            msg:"User not authenticated",
            solution:"Please provide valide token in hearders"
        })
    }

}

