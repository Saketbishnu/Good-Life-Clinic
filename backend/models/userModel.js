import mongoose  from "mongoose";
import { DEFAULT_PROFILE_IMAGE } from "../constants/defaults.js";

const normalizePhone = (phone) => String(phone || '').replace(/\D/g, '')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  image: { type: String, default: DEFAULT_PROFILE_IMAGE },
  address: { type: Object, default:{line1:'',line2:''} },
  gender: {type: String,default:"Not Selected"},
  dob: {type: String,default:"Not Selected"},
  phone: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    default: '',
    maxlength: 10,
    set: normalizePhone,
    validate: {
      validator: (value) => !value || /^[6-9]\d{9}$/.test(value),
      message: "Please enter a valid Indian mobile number"
    }
  }

})

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;

