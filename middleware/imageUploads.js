import multer from "multer";

const imageUploads = multer.diskStorage({
    destination: (req,file,cb) =>{
        return cb(null,'uploads/');
    },
    filename: (req,file,cb) =>{
        return cb(null,Date.now() + "-" + file.originalname);
    }
})

const upload = multer({storage:imageUploads}).single('image');

export default upload;