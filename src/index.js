
import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({
    path:"./.env"
});







connectDB() 













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