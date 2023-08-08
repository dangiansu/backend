const User = require('../models/user')
const cloudinary = require('cloudinary').v2;
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key:  process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY
});
//user registeration 
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
//user login
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
            const validepassword = await bcrypt.compare(password , user.password)
            if(validepassword){
                const token = jwt.sign({ 
                    _id : user._id, 
                    role: user.role,
                    name: user.fullname,
                    user_image: user.user_image,
                    cloudinary_id:user.cloudinary_id

                },
                  process.env.PRIVATEKEY);
                  res.status(200).send({
                    status:"200",
                    success: true,
                    token,
                    fullname: user.fullname,
                    role:user.role,
                    _id: user._id
                  })
            }
            else{
                return res.status(404).send({
                    msg:"incoreect password "
                })
            }

        }
        else{
            return res.status(404).send({
                msg:"first you have register then login"
            })
        }
    }
    catch(e){
       console.log(e)
       res.status(404).send({
        msg:"server error",
        status:"500"
       })
    }
}
//getallusers
exports.getallusers = async (req,res)=>{
    try{
        let alluser = await User.find({role:"user"})
        if(!alluser){
            return res.status(404).send({
                msg:"users are not available"
            })
        }
        return res.status(200).send({
           status:"200",
           success:true,
           users: alluser

        })

    }
    catch(err){
        console.log(err)
        return res.status(500).send({
            msg:"Server error"
        })
    }
}
//delete user
exports.deleteuser = async (req,res)=>{
    try{
       let user = await User.findByIdAndDelete({_id: req.user._id}).select({password:0})
       if(!user){
        return res.status(404).send({
            success:false,
            msg:"user not found"
        })
       }
       res.status(200).send({
        status:"200",
        success: true,
        msg:"user successfully deleted"
       })

    }
    catch(err){
        console.log(err)
        return res.status(500).send({
            status:"500",
            success: false,
            msg:"server error"
        })
    }
}
//user profile
exports.profile = async (req,res)=>{
    try{
        const user = await User.findById({_id:req.user._id}).select({password:0 ,role:0})
        if(!user){
            return res.status(404).send({
                status:"404",
                success: false,
                msg:"user not found"
            })
        }
        res.status(200).send({
            status:"200",
            success: true,
            user:user

        })
    }
    catch(err){
        console.log(err)
        return res.status(500).send({
            status:"500",
            success:false,
            msg:"server error"
        })
    }
}
//updateuser
exports.updateuser = async (req,res)=>{
    try{
        const {fullname,bio,phone} = req.body
        // console.log(req.body)
        if(!fullname  && !bio && !phone){
            return res.status(404).send({
                status:"404",
                msg:"both filed are required"
            })
        }
        // const user_id = req.user._id
        const userdata = {
            fullname,
            bio,
            phone,
        }
        if(req.file){
            const userid = await User.findOne({_id: req.params.uid})
            // console.log("aaaaaaa",userid)
          await cloudinary.uploader.destroy(userid.cloudinary_id);
          if(userid.user_image && userid.cloudinary_id){
              
              const result = await cloudinary.uploader.upload(req.file.path,
                {
                    folder: "WatupUser/images",
                });
                userdata.user_image = result.secure_url,
                userdata.cloudinary_id = result.public_id
          }
        }
        else{
            return res.status(404).send({
                msg:"image not found"
            })
        }     
        const filters =  {_id: req.params.uid}
        const updateUser = await User.findOneAndUpdate(filters,userdata ,{ new:true}).select({password:0,email:0})
        if(!updateUser){
            return res.status(404).send({
                status:"404",
                success:true,
                msg:"user not found "
            })
        }
        res.status(200).send({
            status:"200",
            success: true,
            msg:"user updated successfully",
            updateUser
        })
    }
    catch(err){
        console.log("------>",err)
        return res.status(500).send({
            status:"500",
            success:false,
            msg:"server error"
        })
    }
}