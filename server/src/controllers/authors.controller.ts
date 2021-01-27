import { Request, Response } from 'express'
import { QueryResult } from 'pg'
// pool es la conexion a db tmb se puede llamar db en vez de pool
// en consola poner npm run build (para compilar)
// en consola poner npm run dev (para iniciar el servidor)
import { pool } from '../database'

export const createAuthor = async (req: Request, res: Response): Promise<Response> => {
    // check empty name
    if(!req.body.name){
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO PARA PODER AGREGAR UN AUTOR"
        });
    }
    // guardo en const name lo que llega en el request
    const { name } = (req.body);

    if(name.length > 50) return res.status(400).send({
        message:"NO PUEDE TENER UN NOMBRE DE AUTOR CON MAS DE 50 CARACTERES"
    });
    // insert en PostgreSQL
    const response: QueryResult = await pool.query('INSERT INTO authors (name) VALUES ($1)', [name]);
    return res.json({
        message: 'El author ah sido creado exitosamente!',
        body: {
            author: {
              name           
            }
        }
    })  
  }

  
export const updateAuthor = async (req: Request, res: Response): Promise<Response> => {   
     // check empty name
     if(!req.body.name || !req.body.id_author){
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO PARA ACTUALIZAR EL AUTOR"
        });
    }

    // recibo los datos (de un form, insomnia rest, etc..)
    const { name, id_author} = (req.body);

    if(name.length > 50) return res.status(400).send({
        message: "NO SE PUEDE TENER UN NOMBRE DE AUTOR CON MAS DE 50 CARACTERES"
    })

    let id_aut = parseInt(id_author);
    
    console.log('data recibida: ' + id_aut, name);

    // consulta a PostgreSQL
    await pool.query('UPDATE authors set name = $1 WHERE id_author = $2', [name, id_aut]);
    return res.json({
        message: 'El autor ah sido actualizado exitosamente!',
        body: {
            author: {
              name
            }
        }
    })  
} 

export const getAuthors = async (req: Request, res: Response): Promise<Response> => {
    try {
        const response: QueryResult = await pool.query('SELECT * from authors order by name asc');
        return res.status(200).json(response.rows);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json('Internal server error');
    }
}

export const getAuthorByName = async (req: Request, res: Response): Promise<Response> => {  
    
    console.log('valor recibido: ' + req.params.name);

    if(!req.params.name){
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO, falta el nombre para buscar el autor por nombre"
        })
    }

    try{
        const response: QueryResult = await pool.query(`SELECT * FROM authors WHERE name ILIKE '%${req.params.name}%'`);
        return res.json(response.rows);       
    }
    catch(e){
        console.log(e);
        return res.status(500).json('error al buscar el autor por nombre');
    }  
}

export const getAuthorById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        const response: QueryResult = await pool.query('SELECT * FROM authors WHERE id_author = $1', [id]);
        return res.json(response.rows[0]);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send({
            message: 'Ha ocurrido un error al intentar obtener el autor por id'
        });
        // return res.status(500).json('Internal server error');
    }
}

export const filterAuthorsByName = async (req: Request, res: Response): Promise<Response> => {
       
    if(!req.params.name){
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO, falta el nombre de autor para buscar el autor"
        })
    }

    try{
        const response: QueryResult = await pool.query(`SELECT * from authors WHERE authors.name iLIKE '%${req.params.name}%'`);
        return res.json(response.rows);
    }
    catch(e){
        console.log(e);
        return res.status(500).json('Error, no se pudo filtrar autores por el nombre');
    }    
}

export const existAuthorByName = async (req: Request, res: Response): Promise<Response> => {  
    
    console.log('Nombre de el autor para evaluar si existe autor: ' + req.params.name);

    if(!req.params.name){
        return res.status(400).send({
            message: "FALTA CONTENIDO EN EL CUERPO, falta el nombre para buscar el autor"
        })
    }

    try{
        const response: QueryResult = await pool.query(`SELECT * FROM authors WHERE name iLIKE '${req.params.name}'`);
        // si hay coincidencia
        if(res.json(response.rowCount > 0)){
            // en Angular obtengo true
            return res.status(200);
        } 
        else{
            // devuelve false
            return res.status(400);
        }
    }
    catch(e){
        console.log(e);
        return res.status(500).json('error al buscar el autor por nombre');
    }  
}



