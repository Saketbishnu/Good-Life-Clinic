import mongoose  from "mongoose";
import { DEFAULT_PROFILE_IMAGE } from "../constants/defaults.js";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  image: { type: String, default: DEFAULT_PROFILE_IMAGE },
  address: { type: Object, default:{line1:'',line2:''} },
  gender: {type: String,default:"Not Selected"},
  dob: {type: String,default:"Not Selected"},
  phone: {type:String, default:'0000000000'}

})

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;

