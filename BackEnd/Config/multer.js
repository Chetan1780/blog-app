import multer from 'multer';
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '-')}`)
    }
})

function fileFilter (req, file, cb) {
    const allowed = ['image/png','image/jpg','image/jpeg','image/webp'];
    if(!allowed.includes(file.mimetype)){
        cb(new Error('Only images are allowed!!'),false);
    }  else{
        cb(null, true)

    }
  }

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })
export default upload;
