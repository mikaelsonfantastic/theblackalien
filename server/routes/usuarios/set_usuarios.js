
const {contains_data, replace_DateCharacter, constains_dataDB, verify_sqlInjection, verify_typePhone, verify_gender, verify_marital_status, verify_typeUser, validateEmail, verify_phone, verify_identity, validate_FormatImageUser, deleteFiles, regEX} = require('../../scripts/scripts')

// auth middlewares
const {verifyToken, verify_AdminRole, verifyUserEnabled} = require('../../middlewares/auth')

// requires conexion db
const Conexion = require('../../config/dbconnect')

// requires express and more
const router = require('express').Router()
const bcrypt = require('bcrypt');

// Insertar usuarios
router.post('/usuarios', (req, res) =>{
    // console.log('body >>', req.body)
    const misDatos = {desc_direccion, cod_municipio, num_telefono, tip_telefono, identidad_per, nom_per, apell_per, sex_per, ind_civil, fec_nac, tip_per, cod_empresa, nom_usuario, pass_usuario, mi_archivo, correo_electronico, estado_usuario, tip_usuario} = req.body;
    // console.log(misDatos)
    if(!contains_data(pass_usuario)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'La contraseña ingresada no es valida.'
            }
        })
    }
    
    // Encriptar la password
    const pass_encriptada = bcrypt.hashSync(misDatos.pass_usuario, 10);
    let sql = '';
    const sqlVerifyEmailExist = `CALL GetOne_UsuariosPorEmail('${correo_electronico}')`
    misDatos.pass_usuario = ''; // Quitar password y correo electronico ya que luego da a confundir al backend que es intento de SQL Injection.. Pero ya se almaceno en 'pass_encriptada'
    misDatos.correo_electronico = ''
    misDatos.img_usuario = '';

    // !! IMPORTANTE
    // LA IMAGEN de usuarios tengo que subirla a la carpeta de 'assets' del Servidor e igual a las de Reportes y Estadisticas


    if(!contains_data(desc_direccion) || !contains_data(cod_municipio) || !contains_data(num_telefono) || !contains_data(tip_telefono) || !contains_data(identidad_per) || !contains_data(nom_per) || !contains_data(apell_per) || !contains_data(sex_per) || !contains_data(ind_civil) || !contains_data(fec_nac) || !contains_data(tip_per) || !contains_data(cod_empresa) || !contains_data(nom_usuario) || !contains_data(pass_encriptada) || !contains_data(correo_electronico) || !contains_data(tip_usuario)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Uno de los datos enviados esta incorrecto.'
            }
        })
    }

    if(!verify_gender(sex_per)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El genero esta incorrecto. Solo puede ser M o F.'
            }
        })
    }

    if(!verify_typePhone(tip_telefono)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo de telefono esta incorrecto. Solo puede ser F o C.'
            }
        })
    }

    if(!verify_marital_status(ind_civil)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El estado civil esta incorrecto. Solo puede ser S, C, D, V.'
            }
        })
    }

    if(!verify_typeUser(tip_usuario)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo de usuario esta incorrecto. Solo puede ser User y Admin.'
            }
        })
    }
    
    if(!verify_phone(num_telefono)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Telefono incorrecto.'
            }
        })
    }

    if(!verify_identity(identidad_per)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Identidad incorrecta.'
            }
        })
    }

    // Reemplazando caracteres de la fecha para evitar confusion de SQL Injection y saltarse esa seguridad
    if(misDatos.fec_nac !== undefined){
        misDatos.fec_nac = replace_DateCharacter(misDatos.fec_nac)
    }

    if(verify_sqlInjection(misDatos)){ // Verificar si mas de algun campo tiene caracteres para intento de SQL (o simplemente puso alguno especial)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!validateEmail(correo_electronico)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'El correo esta incorrecto, ingrese de nuevo.'
            }
        })
    }


    Conexion.query(sqlVerifyEmailExist, (err, result) =>{
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

        if(constains_dataDB(result[0])){ // Comprobar si ese correo ya fue registrado antes
            return res.status(400).json({
                ok: true,
                message: 'Ese correo ya ha sido registrado. Ingrese uno nuevo.'
            })
        }



        if (!req.files) { // Si no se cargo la foto
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se ha selecciondo ninguna foto de perfil.'
                }
            });
        }
        let archivo = req.files.mi_archivo;
        // console.log('ACA >>', archivo)
        let nombreCorto = archivo.name.split('.')
        let extencionArchivo = nombreCorto[nombreCorto.length - 1];

        if (!validate_FormatImageUser(extencionArchivo)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La extension de ese archivo no esta permitida.'
                }
            })
        }

        let nombreArchivo = `${correo_electronico}-${new Date().getMilliseconds()}.${extencionArchivo}`


        archivo.mv(`./uploads/usuarios/${nombreArchivo}`, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            // Imagen ya esta cargada
            const sql = `CALL Ins_Usuarios('${desc_direccion}', ${cod_municipio}, '${num_telefono}', '${tip_telefono}', '${identidad_per}', '${nom_per}', '${apell_per}', '${sex_per}', '${ind_civil}', '${fec_nac}', '${tip_per}', ${cod_empresa}, '${nom_usuario}', '${pass_encriptada}', '${nombreArchivo}', '${correo_electronico}', 'Enabled', '${tip_usuario}')`
          
            // Almacenar usuario
            Conexion.query(sql, (err, result) =>{
                if(err) {
                    deleteFiles('usuarios', nombreArchivo); // <- Que me elimine la imagen
                    if(err.errno === 1452){ // No existe ese dato en la relacion con llaves foraneas
                        return res.status(500).json({
                            ok: false,
                            err: {
                                message: 'No existe ese municipio o empresa registrado.'
                            }
                        })
                    }
                    if(err.errno === 1318){
                        return res.status(500).json({
                            ok: false,
                            err: {
                                message: 'Un parametro del proceso enviado, esta incorrecto.'
                            }
                        })
                    }
    
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
    
                res.json({
                    ok: true,
                    message: 'Registrado con exito!.'
                })
            })
        })
        
    })
})


// Get All -> Usuarios
router.get('/usuarios', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    let sql = 'CALL GetAll_Usuarios()'
    
    Conexion.query(sql, (err, result) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!constains_dataDB(result[0])){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'No hay usuarios registrados.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })

})

// Get One Usuarios
router.get('/usuarios/:id', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const idUser = req.params.id;
    let sql = `CALL GetOne_Usuarios(${idUser})`
    
    Conexion.query(sql, (err, result) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!constains_dataDB(result[0])){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'No hay usuarios registrados con ese Id.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })

})


// Update Usuario por id
router.put('/usuarios/:id', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const idUsuario = req.params.id;
    const misDatos = {desc_direccion, cod_municipio, num_telefono, tip_telefono, identidad_per, nom_per, apell_per, sex_per, ind_civil, fec_nac, tip_per, cod_empresa, nom_usuario, pass_usuario, mi_archivo, estado_usuario, tip_usuario} = req.body;
    const sqlVerifyUserExist = `CALL GetOne_Usuarios(${idUsuario})`

    if(!contains_data(pass_usuario)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'La contraseña ingresada no es valida.'
            }
        })
    }

    // Encriptar la password
    const pass_encriptada = bcrypt.hashSync(misDatos.pass_usuario, 10);
    // const sql = `CALL Upt_Usuarios(${idUsuario}, '${nom_usuario}', '${pass_encriptada}', '${img_usuario}', 'Enabled', '${tip_usuario}', '${desc_direccion}', ${cod_municipio}, '${num_telefono}', '${tip_telefono}', '${identidad_per}', '${nom_per}', '${apell_per}', '${sex_per}', '${ind_civil}', '${fec_nac}', '${tip_per}', ${cod_empresa})`
    let sql = '';
    misDatos.pass_usuario = ''; // Quitar password y correo electronico ya que luego da a confundir al backend que es intento de SQL Injection.. Pero ya se almaceno en 'pass_encriptada'
    misDatos.img_usuario = '';
    misDatos.correo_electronico = '';

    // !! IMPORTANTE
    // LA IMAGEN de usuarios tengo que subirla a la carpeta de 'assets' del Servidor e igual a las de Reportes y Estadisticas


    if(!contains_data(desc_direccion) || !contains_data(cod_municipio) || !contains_data(num_telefono) || !contains_data(tip_telefono) || !contains_data(identidad_per) || !contains_data(nom_per) || !contains_data(apell_per) || !contains_data(sex_per) || !contains_data(ind_civil) || !contains_data(fec_nac) || !contains_data(tip_per) || !contains_data(cod_empresa) || !contains_data(nom_usuario) || !contains_data(pass_encriptada) || !contains_data(tip_usuario)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Uno de los datos enviados esta incorrecto.'
            }
        })
    }

    if(!verify_gender(sex_per)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El genero esta incorrecto. Solo puede ser M o F.'
            }
        })
    }

    if(!verify_typePhone(tip_telefono)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo de telefono esta incorrecto. Solo puede ser F o C.'
            }
        })
    }

    if(!verify_marital_status(ind_civil)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El estado civil esta incorrecto. Solo puede ser S, C, D, V.'
            }
        })
    }

    if(!verify_typeUser(tip_usuario)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo de usuario esta incorrecto. Solo puede ser User y Admin.'
            }
        })
    }
    
    if(!verify_phone(num_telefono)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Telefono incorrecto.'
            }
        })
    }

    if(!verify_identity(identidad_per)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Identidad incorrecta.'
            }
        })
    }

    // Reemplazando caracteres de la fecha para evitar confusion de SQL Injection y saltarse esa seguridad
    if(misDatos.fec_nac !== undefined){
        misDatos.fec_nac = replace_DateCharacter(misDatos.fec_nac)
    }

    if(verify_sqlInjection(misDatos)){ // Verificar si mas de algun campo tiene caracteres para intento de SQL (o simplemente puso alguno especial)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }


    // actualizar usuario
    Conexion.query(sqlVerifyUserExist, (err, result) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!constains_dataDB(result[0])){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'No existe el usuario a actualizar.'
                }
            })
        }

        if (!req.files) { // Si no se cargo la foto
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se ha selecciondo ninguna foto de perfil.'
                }
            });
        }
        let archivo = req.files.mi_archivo;
        // console.log('ACA >>', archivo)
        let nombreCorto = archivo.name.split('.')
        let extencionArchivo = nombreCorto[nombreCorto.length - 1];
        
        if (!validate_FormatImageUser(extencionArchivo)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La extension de ese archivo no esta permitida.'
                }
            })
        }

        let correo_electronico = result[0][0].correo_electronico;
        let imgUserDB = result[0][0].img_usuario;
        let nombreArchivo = `${correo_electronico}-${new Date().getMilliseconds()}.${extencionArchivo}`

        archivo.mv(`./uploads/usuarios/${nombreArchivo}`, (err) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            // Imagen ya esta cargada
            sql = `CALL Upt_Usuarios(${idUsuario}, '${nom_usuario}', '${pass_encriptada}', '${nombreArchivo}', 'Enabled', '${tip_usuario}', '${desc_direccion}', ${cod_municipio}, '${num_telefono}', '${tip_telefono}', '${identidad_per}', '${nom_per}', '${apell_per}', '${sex_per}', '${ind_civil}', '${fec_nac}', '${tip_per}', ${cod_empresa})`
          

            // Almacenar usuario
            Conexion.query(sql, (err, result) =>{
                if(err) {
                    deleteFiles('usuarios', nombreArchivo); // <- Que me elimine la imagen
                    if(err.errno === 1452){ // No existe ese dato en la relacion con llaves foraneas
                        return res.status(500).json({
                            ok: false,
                            err: {
                                message: 'No existe ese municipio o empresa registrado.'
                            }
                        })
                    }
                    if(err.errno === 1318){
                        return res.status(500).json({
                            ok: false,
                            err: {
                                message: 'Un parametro del proceso enviado, esta incorrecto.'
                            }
                        })
                    }
    
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                // Eliminar imagen anterior
                deleteFiles('usuarios', imgUserDB)
    
                res.json({
                    ok: true,
                    message: 'Actualizado con exito!.'
                })
            })
        })
    })


})



router.delete('/usuarios/:id', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const idUsuario = req.params.id;
    const sql = `CALL Del_Usuarios(${idUsuario})`
    const sqlVerifyUserExist = `CALL GetOne_Usuarios(${idUsuario})`

    Conexion.query(sqlVerifyUserExist, (err, result) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!constains_dataDB(result[0])){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'No existe el usuario a eliminar.'
                }
            })
        }

        // user status -> result[0][0].estado_usuario
        if(!verifyUserEnabled(result[0][0].estado_usuario)){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Ese usuario ya se encontraba eliminado anteriormente.'
                }
            })
        }

        Conexion.query(sql, (err, result) =>{
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                message: 'Usuario eliminado con exito!'
            })
        })
       
    })


})





module.exports = router;



// qwe