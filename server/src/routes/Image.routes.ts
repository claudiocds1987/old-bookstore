
// import { Router } from 'express'
// const router = Router();

// const path = require('path');

// const multer = require('multer');
// // middlewares
// const storage = multer.diskStorage({
//     destination: path.join(__dirname, 'public/uploads'),
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     } 
// })

// router.get('/', (req, res) => {
//     res.render('nose');
// });

// const upload = multer({
//     storage,
//     dest: path.join(__dirname, 'public/uploads'),
//     limits: {fileSize: 2000000}, //max permitido de image, 2 mega byte de peso
//     fileFilter: (req, file, cb) => {
//         const fileTypes = /jpeg|jpg|png|gif/;
//         const mimetype = fileTypes.test(file.mimetype);
//         const extname = fileTypes.test(path.extname(file.originalname));
//         if(mimetype && extname){
//             return cb(null, true);
//         }
//         else{
//             cb("Error: el archivo debe ser una imagen valida");
//         }
//     }
// }).single('image');

// // esta es la ruta del navegador
// router.post('/upload', upload, (req, res) => {
//     console.log(req.file);
//     res.send('uploaded');
// });

// module.exports = router;