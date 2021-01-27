import { Request, Response } from 'express'
import { QueryResult } from 'pg'
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run dev (para iniciar el servidor?)
import { pool } from '../database'

export const createEditorial = async (req: Request, res: Response): Promise<Response> => {
    // check empty name
    if(!req.body.name){
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO PARA PODER AGREGAR UNA EDITORIAL"
        });
    }
     // guardo en const lo que llega en el request
    let { name } = (req.body);
    if(name.length > 50) return res.status(400).send({
        message:"NO PUEDE TENER UN NOMBRE DE EDITORIAL CON MAS DE 50 CARACTERES"
    });

    let id;
    /* nota: la columna id_editorial en la db no es de type serial(autoincremental), entonces 1ro consulto 
    si hay registros. si hay, al id le sumo 1, caso contrario, si no hay registros, el id = 1.*/
    // check si hay registros en la base de datos
    const editorials: QueryResult = await pool.query('select * from editorials');
    // si hay registros
    if(editorials.rowCount > 0){
        // sumo 1 al id
        id = editorials.rowCount + 1;
    }
    else{
        // si no hay registros, id = 1
        id = 1;
    }
    // insert en PostgreSQL
        const response: QueryResult = await pool.query('INSERT INTO editorials (id_editorial, name) VALUES ($1, $2)', [id, name]);
        return res.json({
            message: 'la editorial ah sido creada exitosamente!',
            body: {
                category: {
                name           
                }
            }
        })
}



export const updateEditorial = async (req: Request, res: Response): Promise<Response> => {   
    // check empty name
    if(!req.body.name || !req.body.id_editorial){
       return res.status(400).send({
           message: "FALTA CONTENIDO EN EL CUERPO PARA ACTUALIZAR LA EDITORIAL"
       });
   }

   // recibo los datos (de un form, insomnia rest, etc..)
   const { name, id_editorial} = (req.body);

   if(name.length > 50) return res.status(400).send({
       message: "NO SE PUEDE TENER UN NOMBRE DE EDITORIAL CON MAS DE 50 CARACTERES"
   })

   let id_edit = parseInt(id_editorial);
   
   console.log('data recibida: ' + id_edit, name);

   // consulta a PostgreSQL
   await pool.query('UPDATE editorials set name = $1 WHERE id_editorial = $2', [name, id_edit]);
   return res.json({
       message: 'La editorial ah sido actualizada exitosamente!',
       body: {
           editorial: {
             name
           }
       }
   })  
} 


export const getEditorials = async (req: Request, res: Response): Promise<Response> => {
    try{
        const response: QueryResult = await pool.query('SELECT * from editorials');
        return res.status(200).json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json('Internal server error');
    }    
}

export const getEditorialById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('SELECT * FROM editorials WHERE id_editorial = $1', [id]);
        return res.json(response.rows[0]);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send({
            message: 'Ha ocurrido un error al intentar obtener la editorial por id'
        });
        // return res.status(500).json('Internal server error');
    }
}

export const getEditorialByName = async (req: Request, res: Response): Promise<Response> => {  
    
    console.log('valor recibido: ' + req.params.name);

    if(!req.params.name){
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO, falta el nombre para buscar la editorial"
        })
    }

    try{
        const response: QueryResult = await pool.query(`SELECT * FROM editorials WHERE name ILIKE '%${req.params.name}%'`);
        return res.json(response.rows);       
    }
    catch(e){
        console.log(e);
        return res.status(500).json('error al buscar la editorial por nombre');
    }  
}

export const existEditorialByName = async (req: Request, res: Response): Promise<Response> => {  
    
    console.log('Nombre de la editorial para evaluar si existe editorial: ' + req.params.name);

    if(!req.params.name){
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO, falta el nombre para buscar la editorial"
        })
    }

    try{
        const response: QueryResult = await pool.query(`SELECT * FROM editorials WHERE name iLIKE '${req.params.name}'`);
        // return res.json(response.rows);
        if(res.json(response.rowCount > 0)){
            // si existe el nombre de editorial, en Angular devuelve true
            return res.status(200);
        } 
        else{
            // devuelve false
            return res.status(400);
        }
    }
    catch(e){
        console.log(e);
        return res.status(500).json('error al buscar la editorial por nombre');
    }  
}