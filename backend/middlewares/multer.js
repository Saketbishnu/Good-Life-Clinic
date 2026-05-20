import multer from 'multer'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const uploadDir = 'uploads/'
const allowedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        fs.mkdir(uploadDir, { recursive: true }, (error) => {
            callback(error, uploadDir)
        })
    },
    filename: function(req, file, callback){
        const ext = path.extname(file.originalname).toLowerCase()
        const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`
        callback(null, uniqueName)
    }
})

const fileFilter = (req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
        return callback(new Error('Only JPEG, PNG, and WEBP image uploads are allowed'))
    }

    callback(null, true)
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    }
})

export default upload
