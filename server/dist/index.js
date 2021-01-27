"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const cors = require('cors'); // para que el server acepte peticiones de cualquier puerto ej 4200 de Angular
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const books_routes_1 = __importDefault(require("./routes/books.routes"));
const authors_routes_1 = __importDefault(require("./routes/authors.routes"));
const editorials_routes_1 = __importDefault(require("./routes/editorials.routes"));
const categories_routes_1 = __importDefault(require("./routes/categories.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
// para que acepte peticiones de cualquier puerto ej 4200 de Angular, caso contrario desde Angular va a dar un error de Police cors
app.use(cors());
// middlewares son funciones que se ejecutan antes de que lleguen a las rutas
app.use(express_1.default.json());
// para que al enviar datos de un formulario los convierta a objeto json
app.use(express_1.default.urlencoded({ extended: false }));
app.use(user_routes_1.default);
app.use(books_routes_1.default);
app.use(authors_routes_1.default);
app.use(editorials_routes_1.default);
app.use(categories_routes_1.default);
app.use(admin_routes_1.default);
app.listen(4000);
console.log('Server on Port', 4000);
