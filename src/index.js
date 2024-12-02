import mongoose from "mongoose";
import { DB_NAME } from "./constants";



  const app=express();
(async ()=>{

    try { await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    app.on((error)=>{
     console.log(error);
     throw error
    });
    let PORT= process.env.PORT
    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })

        
    } catch (error) {
        console.log("Error:", error)
        throw error
    }
})();