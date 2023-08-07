const User = require('../models/user')
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key:  process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY
});

exports.register = async (req,res)=>{
const { fullname, email,password,phone,bio} = req.body
console.log(req.body)
if(!fullname && !email && !password && !phone && !bio ){
  return res.status(404).send({
    msg:"all fild is required"
  })
}
if(!fullname || !email || !password || !phone || !bio ){
    return res.status(404).send({
        msg:"please both fild is required"
    })
}
try{
    const hashpassword = bcrypt.hashSync(req.body.password,8)
    const Email = await User.findOne({email})
    if(Email){ 
        return res.status(403).send({
            msg:"User already exists",
            sugestion:"can you please try to another eamil id"
        })
    }
    if(!req.file){
         return res.status(404).send({msg:"Image Not found"})
    }
    const result = await cloudinary.uploader.upload(req.file.path,
        {
            folder: "WatupUser/images",
        });
     const user = await User.create({
        fullname,
        email,
        password:hashpassword,
        phone,
        bio,
        user_image : result.secure_url,
        cloudinary_id : result.public_id
     })
     return res.status(200).send({
        msg:"user registration Successfully",
        status:"200",
        sucess :true,
        User:user
     })
} 
catch(e){
    console.log(e)
    return res.status(500).send({
        msg: "server error",
        status:"500",    
    })
}
}

exports.login = async (req,res)=>{
    try{
        const {email,password} = req.body
        if(!email && !password){
            return res.status(404).send({
                msg:"Plese enter both deatil"
            })
        }
        if(!email || !password){
            return res.status(404).send({
                msg:"enter the deatile"
            })
        }
        const user = await User.findOne({email:email})
        if(user){
            // const Password = await User.findOne({})

        }
        else{
            return res.status(404).send({
                msg:"first you have register then login"
            })
        }
    }
    catch(e){
       console.log(e)
    }
}