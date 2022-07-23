const {contains_data, constains_dataDB, verify_sqlInjection, replace_DateCharacter, regEX} = require('../../scripts/scripts')

// auth middlewares
const {verifyToken, verify_AdminRole, verifyUserEnabled} = require('../../middlewares/auth')

// requires conexion db
const Conexion = require('../../config/dbconnect')

// requires express and more
const router = require('express').Router()


// Insert Inventario
router.post('/inventario', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const misDatos = {id_pro, nom_pro, unidad_pro, pre_pro, fec_elab, fec_venc} = req.body;
    const sql = `CALL Ins_Inventario_Inicial('${id_pro}', '${nom_pro}', ${unidad_pro}, ${pre_pro}, '${fec_elab}', '${fec_venc}')`

    if(!contains_data(id_pro) || !contains_data(nom_pro) || !contains_data(unidad_pro) || !contains_data(pre_pro) || !contains_data(fec_elab) || !contains_data(fec_venc) || pre_pro <= 0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Uno de los datos enviados esta incorrecto.'
            }
        })
    }

    // Reemplazando caracteres de la fecha para evitar confusion de SQL Injection y saltarse esa seguridad
    if(misDatos.fec_elab !== undefined && misDatos.fec_venc !== undefined){
        misDatos.fec_elab = replace_DateCharacter(misDatos.fec_elab)
        misDatos.fec_venc = replace_DateCharacter(misDatos.fec_venc)
    }

    if(verify_sqlInjection(misDatos)){ // Verificar si mas de algun campo tiene caracteres para intento de SQL (o simplemente puso alguno especial)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    // Almacenar datos
    Conexion.query(sql, (err, result) =>{
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            message: 'Inventario agregado con exito!'
        })
    })
})


// Get All Inventario
router.get('/inventario', [verifyToken, verifyUserEnabled], (req, res) =>{
    const sql = 'CALL GetAll_Inventario()'

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
                    message: 'No hay un inventario.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Get One Inventario
router.get('/inventario-one/:id', [verifyToken, verifyUserEnabled], (req, res) =>{
    const codProducto = req.params.id;
    const sql = `CALL GetOne_Inventario(${codProducto})`

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
                    message: 'No existe ese producto registrado.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Get One Inventario x ID Producto
router.get('/inventario/:id', [verifyToken, verifyUserEnabled], (req, res) =>{
    const idProducto = req.params.id;
    const sql = `CALL GetOne_InventarioPorIdProducto('${idProducto}')`

    if(!contains_data(id_pro) || !contains_data(nom_pro) || !contains_data(unidad_pro) || !contains_data(pre_pro) || !contains_data(fec_elab) || !contains_data(fec_venc) || pre_pro <= 0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Uno de los datos enviados esta incorrecto.'
            }
        })
    }

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
                    message: 'No existen productos de esa categoria'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Actualizar Inventario
router.put('/inventario/:id', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const idInventario = req.params.id;
    const misDatos = {id_pro, nom_pro, unidad_pro, pre_pro, fec_elab, fec_venc} = req.body;
    const sql = `CALL Upt_Inventario_Inicial(${idInventario}, '${id_pro}', '${nom_pro}', ${unidad_pro}, ${pre_pro}, '${fec_elab}', '${fec_venc}')`
    const sql2 = `CALL GetOne_Inventario(${idInventario})`

    if(!contains_data(id_pro) || !contains_data(nom_pro) || !contains_data(unidad_pro) || !contains_data(pre_pro) || !contains_data(fec_elab) || !contains_data(fec_venc) || pre_pro <= 0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Uno de los datos enviados esta incorrecto.'
            }
        })
    }

    // Reemplazando caracteres de la fecha para evitar confusion de SQL Injection y saltarse esa seguridad
    if(misDatos.fec_elab !== undefined && misDatos.fec_venc !== undefined){
        misDatos.fec_elab = replace_DateCharacter(misDatos.fec_elab)
        misDatos.fec_venc = replace_DateCharacter(misDatos.fec_venc)
    }

    if(verify_sqlInjection(misDatos)){ // Verificar si mas de algun campo tiene caracteres para intento de SQL (o simplemente puso alguno especial)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if(!contains_data(idInventario)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Id Inventario no valido.'
            }
        })
    }

   
    // Ver si existe ese Inventario
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
                    message: 'No existe un producto con ese ID registrado.'
                }
            })
        }

        // Actualizar Inventario
        Conexion.query(sql, (err, result) =>{
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                message: 'Inventario actualizado con exito!'
            })
        })
    })
})





module.exports = router;


// qwe