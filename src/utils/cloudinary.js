import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_KEY_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary=async (file)=>{
    try {
        if(!file) return null;
         const response= await cloudinary.uploader.upload(file,{
            resource_type:"auto",
         }); 
         console.log("FIle has been Uploaded",response.url)
         return response.url
        
    } catch (error) {
        fs.unlinkSync(file);  //remove tempory file if upload get error
        console.log(error);
        return null;

    }
}


export {uploadOnCloudinary}

// (async function() {

//     // Configuration
//     cloudinary.config({ 
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//         api_key: process.env.CLOUDINARY_API_KEY, 
//         api_secret: process.env.CLOUDINARY_API_KEY_SECRET, // Click 'View API Keys' above to copy your API secret
//     });
    
//     // Upload an image
//      const uploadOnCloudinary = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                resource_type:"auto",
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadOnCloudinary);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();