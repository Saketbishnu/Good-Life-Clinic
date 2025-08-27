import multer from 'multer'
import path from 'path'; // You'll need to import the path module

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads/'); // Create an 'uploads' directory in your project root
    },
    filename: function(req, file, callback){
        // It's a good practice to use a unique filename to avoid collisions
        callback(null, Date.now() + path.extname(file.originalname)); 
    }
})

const upload = multer({storage})

export default upload