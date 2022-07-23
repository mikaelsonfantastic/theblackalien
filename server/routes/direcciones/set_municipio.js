
// requires scripts assistant
const {contains_data, constains_dataDB, regEX} = require('../../scripts/scripts')

// auth middlewares
const {verifyToken, verifyUserEnabled, verify_AdminRole} = require('../../middlewares/auth')

// requires conexion db
const Conexion = require('../../config/dbconnect')

// requires express and more
const router = require('express').Router()


// Insert Municipio
router.post('/municipio', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const {nom_municipio, id_depto} = req.body;
    const sql = `CALL Ins_Municipio('${nom_municipio}', ${id_depto})`
    
    if(regEX.test(nom_municipio) || regEX.test(id_depto)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!contains_data(nom_municipio) || !contains_data(id_depto)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Nombre del municipio o idDepto no valido.'
            }
        })
    }
   
    Conexion.query(sql, (err, result) =>{
        if(err) {
            if(err.errno === 1452){ // No existe ese depto en la relacion
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No existe ese depto en la DB.'
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
            message: 'Municipio registrado con exito!'
        })
    })
})


// Get All Municipio
router.get('/municipio', [verifyToken, verifyUserEnabled], (req, res) =>{
    const sql = 'CALL GetAll_Municipio()'

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
                    message: 'No hay Municipios registrados.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Get All Municipio por Depto
router.get('/municipio/:id_depto', [verifyToken, verifyUserEnabled], (req, res) =>{
    const idDepto = req.params.id_depto;
    const sql = `CALL GetAll_MunicipiosPorDepto(${idDepto})`

    Conexion.query(sql, (err, result) =>{
        if(err){
            if(err.errno === 1054){ // En caso de que el ID del Depto este mal escrito (que contenga letras o algo asi)...
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'ID del Departamento no valido.'
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
                    message: 'No hay Municipios registrados.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Get One Municipio
router.get('/municipio-one/:id', [verifyToken, verifyUserEnabled], (req, res) =>{
    const idMunicipio = req.params.id;
    const sql = `CALL GetOne_Municipio(${idMunicipio})`

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
                    message: 'No existe ese municipio registrado.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Actualizar Municipio
router.put('/municipio/:id', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const idMunicipio = req.params.id;
    const {nom_municipio, id_depto} = req.body;
    const sql = `CALL Upt_Municipio(${idMunicipio}, '${nom_municipio}', '${id_depto}')`
    const sql2 = `CALL GetOne_Municipio(${idMunicipio})`

    if(regEX.test(nom_municipio) || regEX.test(id_depto)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!contains_data(nom_municipio) || !contains_data(id_depto)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Nombre del municipio o idDepto no valido.'
            }
        })
    }

    if(!contains_data(idMunicipio)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Id Municipio no valido.'
            }
        })
    }
   
    // Ver si existe el municipio
    Conexion.query(sql2, (err, result) =>{
        if(err) {
            
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!constains_dataDB(result[0])){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'No existe ese municipio registrado.'
                }
            })
        }

        // Actualizar municipio
        Conexion.query(sql, (err, result) =>{
            if(err) {
                if(err.errno === 1452){ // No existe ese depto en la relacion
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'No existe ese Departamento en la DB.'
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
                message: 'Municipio actualizado con exito!'
            })
        })
    })
})








module.exports = router;

// qwe


// qwe