
import mongoose from "mongoose";

const userSchema=mongoose.Schema(

    {

        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true
        },
        
        fullname:{
            type:String,
            required:true
        }
        ,mobile:{
            type:String,
            required:true
        }
     
        ,
        passwordd:{
            type:String,
            required:true
        },
        role:
        {
            type:[String],
            required:true,
            enum:["admin","user"],
            default:["user"]
        }
     
    } ,
    {
        timestamps:true  // createdAt & updatedAt
    }

)



const User=mongoose.model("User",userSchema)
export default User;