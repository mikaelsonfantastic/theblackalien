

// requires scripts assistant
const {contains_data, constains_dataDB, regEX} = require('../../scripts/scripts')

// auth middlewares
const {verifyToken, verify_AdminRole, verifyUserEnabled} = require('../../middlewares/auth')

// requires conexion db
const Conexion = require('../../config/dbconnect')

// requires express and more
const router = require('express').Router()


// Insert Marcas
router.post('/marcas', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const {nom_marca} = req.body;
    const sql = `CALL Ins_Marca('${nom_marca}')`
    
    if(regEX.test(nom_marca)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!contains_data(nom_marca)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Marca no valida.'
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
            message: 'Marca registrada con exito!'
        })
    })
})


// Get All Marcas
router.get('/marcas', [verifyToken, verifyUserEnabled], (req, res) =>{
    const sql = 'CALL GetAll_Marca()'

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
                    message: 'No hay marcas registradas.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })

})


// Get One Marca
router.get('/marcas/:id', [verifyToken, verifyUserEnabled], (req, res) =>{
    const idMarca = req.params.id;
    const sql = `CALL GetOne_Marca(${idMarca})`

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
                    message: 'No existe esa marca registrada.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Actualizar Marca
router.put('/marcas/:id', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const idMarca = req.params.id;
    const {nom_marca} = req.body;
    const sql = `CALL Upt_Marca(${idMarca}, '${nom_marca}')`
    const sql2 = `CALL GetOne_Marca(${idMarca})`

    if(regEX.test(nom_marca)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!contains_data(nom_marca)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Marca no valida.'
            }
        })
    }

    if(!contains_data(idMarca)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Id Marca no valido.'
            }
        })
    }
   
    // Ver si existe una Marca
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
                    message: 'No existe esa marca registrado.'
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
                message: 'Marca actualizada con exito!'
            })
        })
    })
})








module.exports = router;

// qwe


// qwe