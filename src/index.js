
import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({
    path:"./.env"
});







connectDB() 
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        ContentVisibilityAutoStateChangeEvent.log(`Server is running at port ${process.env.PORT}`)
    } )
})
.catch((error)=>{
 console.log("MONGODB connection error",error);    
})













//   const app=express();
// (async ()=>{

//     try { await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`,
//         {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         }
//     );
   
//     // app.on("error",(error)=>{
//     //  console.log(error)
//     //  throw error
//     // });
//     let PORT= process.env.PORT
//     app.listen(PORT,()=>{
//         console.log(`Server is running on port ${PORT}`)
//     })

        
//     } catch (error) {
//         console.log("Error:", error)
//         throw error
//     }
// })();