const {contains_data, constains_dataDB, verify_sqlInjection, verify_cant, verify_payment, regEX} = require('../../scripts/scripts')

// auth middlewares
const {verifyToken, verify_AdminRole, verifyUserEnabled} = require('../../middlewares/auth')

// requires conexion db
const Conexion = require('../../config/dbconnect')

// requires express and more
const router = require('express').Router()

// Insert Pedido
router.post('/pedido', [verifyToken, verifyUserEnabled], (req, res) =>{
    const misDatos = {
        id_pro_pedido,
        cant_pedido,
        tip_pago,
        cod_distribucion,
        cod_empresa,
        cod_marca,
        cod_pro
    } = req.body;

 
    const sql = `CALL Ins_DetallePedido('${id_pro_pedido}', ${cant_pedido}, 1, '${tip_pago}', ${cod_distribucion}, ${cod_empresa}, ${cod_marca}, ${cod_pro})`
    const sql2 = `CALL GetOne_InventarioPorIdProducto('${id_pro_pedido}')`

    if(!contains_data(id_pro_pedido) || !contains_data(cant_pedido) || !contains_data(tip_pago) || !contains_data(cod_distribucion) || !contains_data(cod_empresa) || !contains_data(cod_marca) || !contains_data(cod_pro)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Uno de los datos enviados esta incorrecto.'
            }
        })
    }

    if(!verify_payment(tip_pago)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'El Tipo de pago esta incorecto.'
            }
        }) 
    }

    if(!verify_cant(cant_pedido)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'La cantidad no puede ser menor o igual que cero.'
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
   
    Conexion.query(sql2, (err, result) =>{ // Comprobar de que el producto pedido exista
        if(err) {
            if(err.errno === 1452){
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error al insertar pedido. Error en la relacion de los datos'
                    }
                })
            }
            if(err.errno === 1054){
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error al insertar pedido. Uno de los datos es erroneo.'
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
                    message: 'No existe ese producto en el inventario.'
                }
            })
        }

        // result[0][0].cod_pro => cod_pro existente 
        // comparar si el id_producto_pedido esta relacionado con el cod_pro del producto que tambien pidio y se encuentra en la DB
        if(cod_pro != result[0][0].cod_pro){
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'ERROR! >>>Ha ocurrido un error al ingresar el pedido, al parecer el ID del producto pedido NO coincide con el ID relacionado al Codigo del Producto. Posiblemente alguien haya manipulado el formulario de envio de datos o esté utilizando una herramienta para enviar estos datos.'
                }
            })
        }

        //  result[0][0].unidad_pro => unidades existentes registradas en el inventario
        // Comprobar si aun hay productos en el inventario
        if(!verify_cant(result[0][0].unidad_pro)){
            return res.status(400).json({
                ok: false,
                message: 'No hay productos de esa categoria.'
            })
        }

        if(result[0][0].unidad_pro < cant_pedido){
            return res.status(400).json({
                ok: false,
                message: `La cantidad en existencia de ese producto es menor a la cantidad pedida. De momento solo hay ${result[0][0].unidad_pro} en existencia...`,
            })
        }

        // Insertar los datos
        Conexion.query(sql, (err, result) =>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                message: 'Pedido registrado con exito!'
            })
        })
    })
})


// Get All Pedido
router.get('/pedido', [verifyToken, verifyUserEnabled], (req, res) =>{
    const sql = 'CALL GetAll_DetallePedidoDesplegado()'

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
                    message: 'No hay pedidos registrados.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Get One Pedido
router.get('/pedido/:id', [verifyToken, verifyUserEnabled], (req, res) =>{
    const id = req.params.id;
    const sql = `CALL GetOne_Inventario(${id})`

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
                    message: 'No existe ese pedido registrado.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })
})


// Actualizar Pedido
router.put('/pedido/:id', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) =>{
    const codPedido = req.params.id;

    const misDatos = {
        id_pro_pedido,
        cant_pedido,
        tip_pago,
        cod_distribucion,
        cod_empresa,
        cod_marca,
        cod_pro
    } = req.body;

    const sql = `CALL Upt_DetallePedido(${codPedido}, '${id_pro_pedido}', ${cant_pedido}, 1, '${tip_pago}', ${cod_distribucion}, ${cod_empresa}, ${cod_marca}, ${cod_pro})`
    const sql2 = `CALL GetOne_DetallePedido('${codPedido}')`
    const sql3= `CALL GetOne_InventarioPorIdProducto('${id_pro_pedido}')`


    if(!contains_data(codPedido) || !contains_data(id_pro_pedido) || !contains_data(cant_pedido) || !contains_data(tip_pago) || !contains_data(cod_distribucion) || !contains_data(cod_empresa) || !contains_data(cod_marca) || !contains_data(cod_pro)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Uno de los datos enviados esta incorrecto.'
            }
        })
    }

    if(!verify_payment(tip_pago)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'El Tipo de pago esta incorecto.'
            }
        }) 
    }
   
    if(!verify_cant(cant_pedido)){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'La cantidad no puede ser menor o igual que cero.'
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
   
    // Comprobar que ese Pedido exista en el historial
    Conexion.query(sql2, (err, result) =>{
        if(err) {
            if(err.errno === 1452){
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error al insertar pedido. Error en la relacion de los datos'
                    }
                })
            }
            if(err.errno === 1054){
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Error al insertar pedido. Uno de los datos es erroneo.'
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
                    message: 'No existe ese pedido registrado en el historial.'
                }
            })
        }

        // Verificar la informacion antes de actualizar los datos para evitar errores
        Conexion.query(sql3, (err, result) =>{
            if(err) {
                if(err.errno === 1452){
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Error al insertar pedido. Error en la relacion de los datos'
                        }
                    })
                }
                if(err.errno === 1054){
                    return res.status(500).json({
                        ok: false,
                        err: {
                            message: 'Error al insertar pedido. Uno de los datos es erroneo.'
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
                        message: 'No existe ese producto en el inventario.'
                    }
                })
            }
    
            // result[0][0].cod_pro => cod_pro existente 
            // comparar si el id_producto_pedido esta relacionado con el cod_pro del producto que tambien pidio y se encuentra en la DB
            if(cod_pro != result[0][0].cod_pro){
                return res.status(500).json({
                    ok: false,
                    err:{
                        message: 'ERROR! >>>Ha ocurrido un error al ingresar el pedido, al parecer el ID del producto pedido NO coincide con el ID relacionado al Codigo del Producto. Posiblemente alguien haya manipulado el formulario de envio de datos o esté utilizando una herramienta para enviar estos datos.'
                    }
                })
            }

            //  result[0][0].unidad_pro => unidades existentes registradas en el inventario
            // Comprobar si aun hay productos en el inventario
            if(!verify_cant(result[0][0].unidad_pro)){
                return res.status(400).json({
                    ok: false,
                    message: 'No hay productos de esa categoria.'
                })
            }

            if(result[0][0].unidad_pro < cant_pedido){
                return res.status(400).json({
                    ok: false,
                    message: `La cantidad en existencia de ese producto es menor a la cantidad pedida.`,
                })
            }
    

            // Actualizar los datos
            Conexion.query(sql, (err, result) =>{
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    message: 'Pedido actualizado con exito!'
                })
            })
        })
    })
})


module.exports = router;


// qwe