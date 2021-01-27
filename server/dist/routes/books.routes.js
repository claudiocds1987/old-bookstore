"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const express_2 = __importDefault(require("express"));
// usando el middleware multer para subir archivos (desde consola npm install --save multer)
var multer = require('multer');
/* usando uuid, (desde consola npm i uuid) es un generador de id para que en el caso de que dos usuarios suban una
imagen con el mismo nombre, no se borren o se pisen al grabarlas */
const uuid = require('uuid');
const app = express_2.default();
const cors = require('cors'); // para que el server acepte peticiones de cualquier puerto ej 4200 de Angular
const path = require('path');
// router.get('/test', (req, res) => res.send('hello world'))
const books_controller_1 = require("../controllers/books.controller");
// ******************* PARA HACER UPLOAD DE IMAGE ******************* //
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        //carpeta donde va a guardar las imgs
        callBack(null, 'public/uploads');
    },
    filename: (req, file, callBack) => {
        // uuid.v4() guarda la img con id aleatorio, para que no
        // se pisen imagenes en el caso que se suban con el mismo nombre
        callBack(null, uuid.v4() + path.extname(file.originalname).toLocaleLowerCase());
    }
});
const upload = multer({
    storage,
    dest: 'uploads/',
    //dest: 'public/uploads', // ?
    //dest: path.join(__dirname, 'public/uploads'),
    limits: { fileSize: 2000000 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/; // expresion regular
        // mimetype checkea si el archivo es valido ej img/extension del archivo
        const mimetype = fileTypes.test(file.mimetype);
        // con path.extname checkea si la img tiene la extension .jpeg o .jpg o .gif o .png
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb("Error: el archivo debe ser una imagen valida");
        }
    }
}).single('file');
router.route('/file').post(upload, (req, res, next) => {
    const file = req.file;
    console.log(file);
    if (!file) {
        console.log('No se subió ninguna imagen');
    }
    res.send(file);
    // para mostrar la ruta por console log
    var ruta = req.file.path;
    console.log('ruta de imagen: ' + ruta);
});
// ******************* FIN UPLOAD DE IMAGE ******************* //
router.get('/books/exist/:name/:id_author', books_controller_1.existBook); // check si existe nombre de libro e id autor
router.get('/books/:id', books_controller_1.getBookByID); // get de libro
router.get('/booksAuthorName', books_controller_1.getBooksWithAuthorName); // get todos los libros con nombre de autor
router.get('/books', books_controller_1.getBooks); // get todos los libros pero con idAuthor
router.get('/bookAuthorName/:id', books_controller_1.getOneBookWithAuthorName); // get de un libro con el nombre de autor
router.get('/filterBooksByName/:name', books_controller_1.filterBooksByName);
router.post('/books', upload, books_controller_1.createBook); // crear libro
router.put('/books/:id', upload, books_controller_1.updateBook); // actualizar libro
router.get('/getRealDataBook/:id', books_controller_1.getRealDataBook);
// router.delete('/users/:username', deleteUser); // delete usuario
exports.default = router;
