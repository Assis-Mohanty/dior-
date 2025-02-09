import mongoose ,{Schema}from "mongoose";
import bcrypt from "bcryptjs";
const userSchema= new Schema({
    username:{
        type: String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true,
        lowercase:true
    },
    avatar:{
        type: String,
        required:true,
    },
    password:{
        type: String,
        required:true,
    },
    refreshToken:{
        type: String
    }

},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
        this.password=await bcrypt.hash(this.password,12)
})

userSchema.methods.isValidPassword=async function(password){
    bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        name:this.name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

const User = mongoose.model('User',userSchema);
export default User;