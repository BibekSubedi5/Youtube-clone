
import dotenv from "dotenv";

import connectDB from "./db/index.js";
import {app} from "./app.js";
dotenv.config({
    path:"./.env"
});




let PORT =process.env.PORT || 8000;


connectDB() 
.then(()=>{
    app.listen(process.env.PORT ,()=>{
        console.log(`Server is running at port ${PORT}`)
        
    } )
})
.catch((error)=>{
 console.log("MONGODB connection errorr",error);    
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