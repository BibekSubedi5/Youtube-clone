import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new mongoose.Schema({
    title:{
    type:String,
    required:true,
    
    },
    videoFile:{
        type:String,
        required:true,


    },
    thumbnail:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true,
    },
    duration:{
       type:Number,
       required:true 
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    ownedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", 
    }
},{timestamp:true});


videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video",videoSchema);