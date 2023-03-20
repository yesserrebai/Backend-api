import mongoose from "mongoose";
import validator from "validator"
import User from "./user.interface";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({

    email:{
        type:String,
        // required: [true,"An email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,"Please provide a valid email"]

    },
    password:{
        type: String,
        // required: [true,"A password is required"],
        // minlength:8,
        select: false
    },

    user:{
        type:String,
        // required: [true,"A username is required"],
        trim: true,
        maxlength: 25
    },

    firstname:{
        type:String,
        // required: [true,"A first name is required"],
        trim: true,
        maxlength: 25
    },
     lastname:{
        type:String,
        // required: [true,"A last name is required"],
        trim: true,
        maxlength: 25
    },
    gender:{
        type: String,
        default: "Male"
    },
    usertype:{
        type:String,
        default: 'user'
    },
    country:{
        type:String,
        // required:[true,"A country is required"]
    },

    city:{
        type: String,
        // required: [true,"A city is required"]
    },
    postalcode:{
        type:String,
        
    },
    phonenumber:{
        type: String,
    },

    language: {
        type: String,
        default: "EN"
    },
    dateofbirth: {
        type: Date,
    },
    avatar:{
        type:String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
    },

},
{timestamps: true})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,12);
    next();
})

//Compare if the password is correct
userSchema.methods.correctPassword = async function(enteredPassword:string,userPassword:string){
    return await bcrypt.compare(enteredPassword,userPassword)
}


const User = mongoose.model<User>('users', userSchema);

export default User;