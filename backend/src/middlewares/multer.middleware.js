import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
      //Date.now()+path.extname(file.originalname)-->creates a unique id for each file
    }
  })
  
export const upload = multer({ 
    storage, 
})