import mongoose from "mongoose"




const subscriptionSchema = new mongoose.Schema(
   {


subscriber:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
},

channel:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
}
   } ,{
    timestamps:true
   }
)



export  const Subscription =mongoose.model("Subscription",subscriptionSchema)