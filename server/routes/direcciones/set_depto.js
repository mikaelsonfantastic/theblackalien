
// requires scripts assistant
const {contains_data, constains_dataDB, regEX} = require('../../scripts/scripts')

// auth middlewares
const {verifyToken, verifyUserEnabled, verify_AdminRole} = require('../../middlewares/auth')

// requires conexion db
const Conexion = require('../../config/dbconnect')

// requires express and more
const router = require('express').Router()


// Insert Depto
router.post('/depto', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const {nom_depto, id_pais} = req.body;
    const sql = `CALL Ins_Departamento('${nom_depto}', ${id_pais})`
    
    if(regEX.test(nom_depto) || regEX.test(id_pais)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!contains_data(nom_depto) || !contains_data(id_pais)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Nombre del depto o idPais no valido.'
            }
        })
    }
   
    Conexion.query(sql, (err, result) =>{
        if(err) {
            if(err.errno === 1452){ // No existe ese pais en la relacion
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No existe ese Pais en la DB.'
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
            message: 'Departamento registrado con exito!'
        })
    })
})


// Get All Depto
router.get('/depto', [verifyToken, verifyUserEnabled], (req, res) =>{
    const sql = 'CALL GetAll_Departamento()'

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
                    message: 'No hay departamentos registrados.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })

})


// Get One Depto
router.get('/depto/:id', [verifyToken, verifyUserEnabled], (req, res) =>{
    const idDepto = req.params.id;
    const sql = `CALL GetOne_Departamento(${idDepto})`

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
                    message: 'No existe ese departamento registrado.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Actualizar Depto
router.put('/depto/:id', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const idDepto = req.params.id;
    const {nom_depto, id_pais} = req.body;
    const sql = `CALL Upt_Departamento(${idDepto}, '${nom_depto}', '${id_pais}')`
    const sql2 = `CALL GetOne_Departamento(${idDepto})`

    if(regEX.test(nom_depto) || regEX.test(id_pais)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!contains_data(nom_depto) || !contains_data(id_pais)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Nombre del depto o idPais no valido.'
            }
        })
    }

    if(!contains_data(idDepto)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Id Departamento no valido.'
            }
        })
    }
   
    // Ver si existe el depto
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
                    message: 'No existe ese departamento registrado.'
                }
            })
        }

        // Actualizar depto
        Conexion.query(sql, (err, result) =>{
            if(err) {
                if(err.errno === 1452){ // No existe ese pais en la relacion
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'No existe ese Pais en la DB.'
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
                message: 'Departamento actualizado con exito!'
            })
        })
    })
})


module.exports = router;

// qwe