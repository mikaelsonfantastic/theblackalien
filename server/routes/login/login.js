
const {contains_data, replace_DateCharacter, constains_dataDB, verify_sqlInjection, verify_typePhone, verify_gender, verify_marital_status, verify_typeUser, validateEmail, verify_phone, verify_identity, verifyUserEnabled, regEX} = require('../../scripts/scripts')

// requires
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const Conexion = require('../../config/dbconnect')


router.post('/login', (req, res) =>{
    const {correo_electronico, password}= req.body;
    const sql = `CALL GetOne_UsuariosPorEmail('${correo_electronico}')`
    // Siguiente version se hara mas verificaciones para evitar SQL Injections

    if(!validateEmail(correo_electronico)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'El correo ingresado no es valido.'
            }
        })
    }

    if(!contains_data(correo_electronico) || !contains_data(password)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Uno de los campos es invalido.'
            }
        })
    }

    Conexion.query(sql, (err, result) =>{
        if(err) {
            if(err.errno === 1064){ // Si da problemas en sintaxis SQL
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El correo ingresado no es valido.'
                    }
                }) 
            }

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!constains_dataDB(result[0])){ // Comprobar si NO existe ese correo
            return res.status(400).json({
                ok: false,
                err:{
                    message: '(Usuario) o contrasena incorrecto.'
                }
            })
        }

        // si existe
        // password UserDB -> result[0][0].pass_usuario
        if(!bcrypt.compareSync(password, result[0][0].pass_usuario)){ // si esta incorrecta la contrasenia
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contrasena) incorrecta.'
                }
            });
        }

        // Logeado con exito!
        // Generar token
        const {cod_usuario, nom_usuario, img_usuario, correo_electronico, estado_usuario, tip_usuario} = result[0][0]
        const usuarioDB = {
            cod_usuario,
            nom_usuario,
            img_usuario,
            correo_electronico,
            estado_usuario,
            tip_usuario
        }
        let token = jwt.sign({
            usuarioDB
        }, process.env.SEED, {expiresIn: process.env.EXPIRE_TOKEN})
        
        res.json({
            ok: true,
            usuarioDB,
            token
        })
    })
})








module.exports = router;

// qwe