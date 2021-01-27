"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ESTE ARCHIVO SERVER.TS ES EL QUE INICIA EL SERVIDOR NODEJS
//--------------------------------------------------------------------------------------
// esto es para utilizar variables de entorno para el token creado en auth.controller
// 1) instale npm i dotenv (para usar variables de entorno para el token) 
// 2) instale npm i @types/dotenv -D para sus metodos
// 3) cree el archivo .env ahi adentro esta la variable de entorno TOKEN_SECRET
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // aca lee las variables de entorno para el token 
//-----------------------------------
const express_1 = __importDefault(require("express"));
// usando el middleware multer para subir archivos (desde consola npm install --save multer)
var multer = require('multer');
/* usando uuid, (desde consola npm i uuid) es un generador de id para que en el caso de que dos usuarios suban una
imagen con el mismo nombre, no se borren o se pisen al grabarlas */
const uuid = require('uuid');
const app = express_1.default(); // inicializo express
const cors = require('cors'); // para que el server acepte peticiones de cualquier puerto ej 4200 de Angular
const path = require('path');
//rutas
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const books_routes_1 = __importDefault(require("./routes/books.routes"));
const authors_routes_1 = __importDefault(require("./routes/authors.routes"));
const editorials_routes_1 = __importDefault(require("./routes/editorials.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const ordersDetail_routes_1 = __importDefault(require("./routes/ordersDetail.routes"));
const sales_routes_1 = __importDefault(require("./routes/sales.routes"));
const salesDetail_routes_1 = __importDefault(require("./routes/salesDetail.routes"));
// stripe para pagos online
const stripe_routes_1 = __importDefault(require("./routes/stripe.routes"));
// para que acepte peticiones de cualquier puerto ej 4200 de Angular, caso contrario desde Angular va a dar un error de Police cors
app.use(cors());
// middlewares son funciones que procesan y transforman las peticiones entrantes en el servidor
app.use(express_1.default.json());
// para que al enviar datos de un formulario los convierta a objeto json
app.use(express_1.default.urlencoded({ extended: false }));
// app.use('/api/auth/', authRoutes);
app.use(auth_routes_1.default);
app.use(user_routes_1.default);
app.use(books_routes_1.default);
app.use(authors_routes_1.default);
app.use(editorials_routes_1.default);
app.use(categories_routes_1.default);
app.use(admin_routes_1.default);
app.use(stripe_routes_1.default);
app.use(orders_routes_1.default);
app.use(ordersDetail_routes_1.default);
app.use(sales_routes_1.default);
app.use(salesDetail_routes_1.default);
// para mostrar la imagen en el navegador escribo ej: http://localhost:4000/1f2d312a-a1ef-48c5-a79f-c2a27c48320c.jpg
app.use(express_1.default.static('public')); // Carpeta public la hago de acceso publica. para pod er ver las imagenes desde el navegador
app.listen(4000);
console.log('Server on Port', 4000);
