const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true,
    },
    user_image:{
     type: String,

    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    bio:{
      type: String,
      required:true,
    },
    cloudinary_id:{
      type:String,
      required:true,
    }
  },
  {
    versionKey: false,
  }
);
const User = mongoose.model("User", UserSchema);

module.exports = User;