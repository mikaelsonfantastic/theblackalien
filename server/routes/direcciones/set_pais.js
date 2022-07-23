
// requires scripts assistant
const {contains_data, constains_dataDB, regEX} = require('../../scripts/scripts')

// auth middlewares
const {verifyToken, verifyUserEnabled, verify_AdminRole} = require('../../middlewares/auth')

// requires conexion db
const Conexion = require('../../config/dbconnect')

// requires express and more
const router = require('express').Router()


// Insert Pais
router.post('/pais', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const {nom_pais} = req.body;
    const sql = `CALL Ins_Pais('${nom_pais}')`
    
    if(regEX.test(nom_pais)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!contains_data(nom_pais)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Nombre de pais no valido.'
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
            message: 'Pais registrado con exito!'
        })
    })
})


// Get All Pais
router.get('/pais', [verifyToken, verifyUserEnabled], (req, res) =>{
    const sql = 'CALL GetAll_Pais()'

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
                    message: 'No hay paises registrados.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })

})


// Get One Pais
router.get('/pais/:id', [verifyToken, verifyUserEnabled], (req, res) =>{
    const idPais = req.params.id;
    const sql = `CALL GetOne_Pais(${idPais})`

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
                    message: 'No existe ese pais registrado.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Actualizar Pais
router.put('/pais/:id', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const idPais = req.params.id;
    const {nom_pais} = req.body;
    const sql = `CALL Upt_Pais(${idPais}, '${nom_pais}')`
    const sql2 = `CALL GetOne_Pais(${idPais})`

    if(regEX.test(nom_pais)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!contains_data(nom_pais)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Nombre de pais no valido.'
            }
        })
    }

    if(!contains_data(idPais)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Id Pais no valido.'
            }
        })
    }
   
    // Ver si existe el pais
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
                    message: 'No existe ese pais registrado.'
                }
            })
        }

        // Actualizar pais
        Conexion.query(sql, (err, result) =>{
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                message: 'Pais actualizado con exito!'
            })
        })
    })
})








module.exports = router;

// qwe