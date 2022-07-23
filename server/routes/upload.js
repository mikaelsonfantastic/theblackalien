
const {validateExtensions, validateTypes, constains_dataDB, deleteFiles} = require('../scripts/scripts')
// requires
const express = require('express')
const fileUpload = require('express-fileupload')
const router = express.Router();

// requires local
const fs = require('fs')
const path = require('path')

// requires conexion db
const Conexion = require('../config/dbconnect')

// default options -> Todo caera en 'req.files'
router.use(fileUpload());

router.post('/upload/:tipo/:id', (req, res) =>{
    const tipo = req.params.tipo;
    const id = req.params.id;

    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Archivo no cargado.'
            }
        })
    }

    // 'archivo' almacenara el archivo
    let archivo = req.files.archivo;
    let nombreArchivoCortado = archivo.name.split('.')
    let extension = nombreArchivoCortado[nombreArchivoCortado.length - 1]

    if(!validateExtensions(extension)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Extension no valida'
            }
        })
    }

    if(!validateTypes(tipo)){
        return res.status(400).json({
            ok: false,
            err:{
                message: `Error, los unicos archivos que se pueden subir son de reportes, estadisticas e imagenes de usuarios. Usted ha ingresado '${tipo}'`
            }
        })
    }

    // Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    // console.log(nombreArchivo)

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        // Imagen cargada
        imagenUsuario(id, res, nombreArchivo, tipo)

        // res.json({
        //     ok: true,
        //     msg: 'Archivo subido'
        // })
    })
})


const imagenUsuario = (id, res, nombreArchivo, tipo) =>{
    const sqlUserExist = `CALL GetOne_Usuarios(${id})`
    const sqlUpdateImgUser = `CALL Upt_ImgUsuario(${id}, '${nombreArchivo}')`

    Conexion.query(sqlUserExist, (err, result) =>{
        if(err){
            // Que me elimine el archivo subido si se produce un error
            deleteFiles(tipo, nombreArchivo); // <- Que me elimine la imagen
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!constains_dataDB(result[0])){
            // Que me elimine el archivo subido si no existe el usuario
            deleteFiles(tipo, nombreArchivo); // <- Que me elimine la imagen
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'No existe ese usuario.'
                }
            })
        }

        // Verificar si ya existe esa imagen
        // img_usuario -> result[0][0].img_usuario
        let imgUsuarioDB = result[0][0].img_usuario;
        deleteFiles(tipo, imgUsuarioDB); // <- Que me elimine la imagen

        Conexion.query(sqlUpdateImgUser, (err, result) =>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                message: 'Imagen actualizada y subida!'
            })
        })
    })
}

module.exports = router;




// qwe