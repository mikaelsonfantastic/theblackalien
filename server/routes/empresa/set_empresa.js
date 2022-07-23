const {contains_data, constains_dataDB, verify_sqlInjection, verify_phone, regEX} = require('../../scripts/scripts')

// auth middlewares
const {verifyToken, verifyUserEnabled, verify_AdminRole} = require('../../middlewares/auth')

// requires conexion db
const Conexion = require('../../config/dbconnect')

// requires express and more
const router = require('express').Router()


// Insert Empresa
router.post('/empresa', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const misDatos = {desc_direccion, cod_municipio, num_telefono, tip_telefono, nom_empresa, tip_empresa} = req.body;
    const sql = `CALL Ins_Empresa('${desc_direccion}', ${cod_municipio}, '${num_telefono}', '${tip_telefono}', '${nom_empresa}', '${tip_empresa}')`
     
    if(!contains_data(desc_direccion) || !contains_data(cod_municipio) || !contains_data(num_telefono) || !contains_data(tip_telefono) || !contains_data(nom_empresa) || !contains_data(tip_empresa)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Uno de los datos enviados esta incorrecto.'
            }
        })
    }

    if(!verify_phone(tip_telefono)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los numeros de telefono permidos son: F o C'
            }
        })
    }

    if(verify_sqlInjection(misDatos)){ // Verificar si mas de algun campo tiene caracteres para intento de SQL (o simplemente puso alguno especial)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }
   
    Conexion.query(sql, (err, result) =>{
        if(err) {
            if(err.errno === 1452){ // No existe ese pais en la relacion
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No existe ese Municipio en la DB.'
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
            message: 'Empresa registrada con exito!'
        })
    })
})


// Get All Empresas (Desplegadas)
router.get('/empresa', [verifyToken, verifyUserEnabled], (req, res) =>{
    const sql = 'CALL GetAll_EmpresaDesplegada()'

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
                    message: 'No hay empresas registradas.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})

// Get One Empresa
router.get('/empresa/:id', [verifyToken, verifyUserEnabled], (req, res) =>{
    const id = req.params.id;
    const sql = `CALL GetOne_EmpresaDesplegada(${id})`

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
                    message: 'No existe esa empresa registrada.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Actualizar Empresa
router.put('/empresa/:id', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const idEmpresa = req.params.id;
    const misDatos = {nom_empresa, tip_empresa, desc_direccion, cod_municipio, num_telefono, tip_telefono} = req.body;

    const sql = `CALL Upt_Empresa(${idEmpresa}, '${nom_empresa}', '${tip_empresa}', '${desc_direccion}', ${cod_municipio}, '${num_telefono}', '${tip_telefono}')`
    const sql2 = `CALL GetOne_Empresa(${idEmpresa})`

    if(!contains_data(desc_direccion) || !contains_data(cod_municipio) || !contains_data(num_telefono) || !contains_data(tip_telefono) || !contains_data(nom_empresa) || !contains_data(tip_empresa)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Uno de los datos enviados esta incorrecto.'
            }
        })
    }

    if(!verify_phone(tip_telefono)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los numeros de telefono permidos son: F o C'
            }
        })
    }

    if(verify_sqlInjection(misDatos)){ // Verificar si mas de algun campo tiene caracteres para intento de SQL (o simplemente puso alguno especial)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!contains_data(idEmpresa)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Id Empresa no valido.'
            }
        })
    }
   
    // Ver si existe esa empresa
    Conexion.query(sql2, (err, result) =>{
        if(err) {
            if(err.errno === 1054){ // En caso de que el parametro enviado no sea admitido o del tipo permitido en el proceso almacenado.
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Parametro incorrecto'
                    }
                })
            }
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!constains_dataDB(result[0])){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'No existe esa empresa registrada.'
                }
            })
        }

        // Actualizar Empresa
        Conexion.query(sql, (err, result) =>{
            if(err) {
                if(err.errno === 1452){ // No existe ese municipio en la relacion
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'No existe ese Municipio en la DB.'
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
                message: 'Empresa actualizada con exito!'
            })
        })
    })
})


module.exports = router;

// qwe