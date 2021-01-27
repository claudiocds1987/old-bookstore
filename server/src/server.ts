// ESTE ARCHIVO SERVER.TS ES EL QUE INICIA EL SERVIDOR NODEJS
//--------------------------------------------------------------------------------------
// esto es para utilizar variables de entorno para el token creado en auth.controller
// 1) instale npm i dotenv (para usar variables de entorno para el token) 
// 2) instale npm i @types/dotenv -D para sus metodos
// 3) cree el archivo .env ahi adentro esta la variable de entorno TOKEN_SECRET
import dotenv from 'dotenv'
dotenv.config(); // aca lee las variables de entorno para el token 
//-----------------------------------
import express from 'express'
// usando el middleware multer para subir archivos (desde consola npm install --save multer)
var multer  = require('multer')
/* usando uuid, (desde consola npm i uuid) es un generador de id para que en el caso de que dos usuarios suban una
imagen con el mismo nombre, no se borren o se pisen al grabarlas */
const uuid = require('uuid')
const app = express(); // inicializo express
const cors = require('cors'); // para que el server acepte peticiones de cualquier puerto ej 4200 de Angular
const path = require('path');
 
//rutas
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import booksRoutes from './routes/books.routes'
import authorsRoutes from './routes/authors.routes'
import editorialsRoutes from './routes/editorials.routes'
import categoriesRoutes from './routes/categories.routes'
import adminRoutes from './routes/admin.routes'
import ordersRoutes from './routes/orders.routes'
import ordersDetailRoutes from './routes/ordersDetail.routes'
import salesRoutes from './routes/sales.routes'
import salesDetailRoutes from './routes/salesDetail.routes'
// stripe para pagos online
import stripeRoutes from './routes/stripe.routes'

// para que acepte peticiones de cualquier puerto ej 4200 de Angular, caso contrario desde Angular va a dar un error de Police cors
app.use(cors());
// middlewares son funciones que procesan y transforman las peticiones entrantes en el servidor
app.use(express.json());
// para que al enviar datos de un formulario los convierta a objeto json
app.use(express.urlencoded({extended: false}));

// app.use('/api/auth/', authRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(booksRoutes);
app.use(authorsRoutes);
app.use(editorialsRoutes);
app.use(categoriesRoutes);
app.use(adminRoutes);
app.use(stripeRoutes);
app.use(ordersRoutes);
app.use(ordersDetailRoutes);
app.use(salesRoutes);
app.use(salesDetailRoutes);

// para mostrar la imagen en el navegador escribo ej: http://localhost:4000/1f2d312a-a1ef-48c5-a79f-c2a27c48320c.jpg
app.use(express.static('public')); // Carpeta public la hago de acceso publica. para pod er ver las imagenes desde el navegador
app.listen(4000);
console.log('Server on Port', 4000);