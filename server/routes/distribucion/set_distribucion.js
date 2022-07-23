const {contains_data, constains_dataDB, regEX} = require('../../scripts/scripts')

// auth middlewares
const {verifyToken, verifyUserEnabled, verify_AdminRole} = require('../../middlewares/auth')

// requires conexion db
const Conexion = require('../../config/dbconnect')

// requires express and more
const router = require('express').Router()


// Insert Distribucion
router.post('/distribucion', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const {num_placa, tip_transporte} = req.body;
    const sql = `CALL Ins_Distribucion('${num_placa}', '${tip_transporte}')`
    const sql2 = `CALL GetOne_DistribucionPorPlaca('${num_placa}')`
     
    if(regEX.test(num_placa) || regEX.test(tip_transporte)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!contains_data(num_placa) || !contains_data(tip_transporte)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Numero de Placa o Tip de Transporte no valido.'
            }
        })
    }
   
    Conexion.query(sql2, (err, result) =>{
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(constains_dataDB(result[0])){ // Si ya existe esa distribucion con esa placa
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'Ese numero de placa ya esta registrada, intente con una nueva.'
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
                message: 'Tipo de distribucion registrada con exito!'
            })
        })

    })
})


// Get All Distribucion
router.get('/distribucion', [verifyToken, verifyUserEnabled], (req, res) =>{
    const sql = 'CALL GetAll_Distribucion()'

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
                    message: 'No hay tipos de distribuciones registradas.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Get One Distribucion
router.get('/distribucion/:id', [verifyToken, verifyUserEnabled], (req, res) =>{
    const id = req.params.id;
    const sql = `CALL GetOne_Distribucion(${id})`

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
                    message: 'No existe esa distribucion registrada.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Actualizar Distribucion
router.put('/distribucion/:id', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const idDistribucion = req.params.id;
    const {num_placa, tip_transporte} = req.body;
    const sql = `CALL Upt_Distribucion(${idDistribucion}, '${num_placa}', '${tip_transporte}')`
    const sql2 = `CALL GetOne_Distribucion(${idDistribucion})`

    if(regEX.test(num_placa) || regEX.test(tip_transporte)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!contains_data(num_placa) || !contains_data(tip_transporte)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Numero de placa ó Tipo de transporte no valido.'
            }
        })
    }

    if(!contains_data(idDistribucion)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Id Marca no valido.'
            }
        })
    }
   
    // Ver si existe esa Distribucion
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
                    message: 'No existe ese Tipo de distribucion registrada.'
                }
            })
        }

        // Actualizar Marca
        Conexion.query(sql, (err, result) =>{
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                message: 'Distribucion actualizada con exito!'
            })
        })
    })
})


module.exports = router;

// qwe


// qwe