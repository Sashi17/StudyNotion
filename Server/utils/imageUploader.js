const cloudinary = require("cloudinary").v2

//Path to the file
//Folder to store the image in Cloudinary
//Optional height to resize
//Optional quality (1-100)
exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    /* options object --> used to configure various upload parameters(ht, quality, folder, format, resource-type)
etc when sending the file to Cloudinary */
    const options = {folder};

    //Supports resizing (height) and quality adjustment
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
};
