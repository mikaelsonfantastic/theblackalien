// requires scripts assistant
const { contains_data, constains_dataDB, validate_FormatStadisticsReports, validate_TypeReportsStatistics, validate_StadisticsAndReports_Index, validate_TimeToGenerate_ReportsStadistics, verify_FormatTime, validateEmail, StadisticsOrReports_isEnabled, deleteFiles, verify_sqlInjection, regEX, regEXTime } = require('../../scripts/scripts')

// auth middlewares
const { verifyToken, verify_AdminRole , verifyUserEnabled} = require('../../middlewares/auth')

// requires conexion db
const Conexion = require('../../config/dbconnect')

// requires express and more
const router = require('express').Router()
    // const fileUpload = require('express-fileupload')

// requires local
const fs = require('fs')
const path = require('path')

// Ins reportes
router.post('/reportes', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) => {
    const misDatos = { titulo_reporte, desc_reporte, correo_electronico, hora_generar_reporte, tipo_reporte, ind_reporte, tiempo_generar_reporte, mi_archivo } = req.body;
    const dataTokenUser = req.usuarioDB;
    const codeTokenUSer = dataTokenUser.cod_usuario;
    let sql;
    misDatos.correo_electronico = '';
    misDatos.hora_generar_reporte = ''

    if(verify_sqlInjection(misDatos)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if (!contains_data(titulo_reporte) || !contains_data(desc_reporte) || !contains_data(correo_electronico) || !contains_data(hora_generar_reporte) || !contains_data(tipo_reporte) || !contains_data(ind_reporte) || !contains_data(tiempo_generar_reporte)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Uno de los datos enviados esta incorrecto.'
            }
        })
    }


    if (!verify_FormatTime(hora_generar_reporte)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El formato de hora para generar reporte no es valido. El formato permitido solamente es de 12h'
            }
        })
    }

    if (!validateEmail(correo_electronico)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El correo esta incorrecto, ingrese de nuevo.'
            }
        })
    }

    if (!validate_TypeReportsStatistics(tipo_reporte)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo de reporte es incorrecto. Solo puede existir Generado o Guardado'
            }
        })
    }

    if (!validate_StadisticsAndReports_Index(ind_reporte)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El indice de reporte no es valido. Solo puede ser Enabled o Disabled.'
            }
        })
    }

    if (!validate_TimeToGenerate_ReportsStadistics(tiempo_generar_reporte)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tiempo de generar reporte esta incorrecto.'
            }
        })
    }

    // let archivo = req.files.archivo;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha selecciondo ningun archivo.'
            }
        });
    }
    let archivo = req.files.mi_archivo;
    let nombreCorto = archivo.name.split('.')
    let extencionArchivo = nombreCorto[nombreCorto.length - 1];

    if (!validate_FormatStadisticsReports(extencionArchivo)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extension de ese archivo no esta permitida.'
            }
        })
    }

    let nombreArchivo = `${codeTokenUSer}-${new Date().getMilliseconds()}.${extencionArchivo}`

    archivo.mv(`./uploads/reportes/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Imagen ya esta cargada
        sql = `CALL Ins_Reportes('${titulo_reporte}', '${desc_reporte}', '${extencionArchivo}', '${nombreArchivo}', '${correo_electronico}', '${hora_generar_reporte}', '${tipo_reporte}', '${ind_reporte}', '${tiempo_generar_reporte}', ${codeTokenUSer})`

        // console.log(sql)
        Conexion.query(sql, (err, result) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                message: 'Reporte registrado con exito!'
            })
        })
    })


})


// Get All Reportes
router.get('/reportes', [verifyToken, verifyUserEnabled], (req, res) => {
    const sql = 'CALL GetAll_ReportesDesplegados()';

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
                    message: 'No hay registros de reportes.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })

})


// Get One Reportes
router.get('/reportes/:id', [verifyToken, verifyUserEnabled], (req, res) => {
    const idReporte = req.params.id;
    const sql = `CALL GetOne_ReportesDesplegados(${idReporte})`;

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
                    message: 'No existe ese reporte registrado en el historial.'
                }
            })
        }

        res.json({
            ok: true,
            result: result[0]
        })
    })

})

// Update reportes
router.put('/reportes/:id', [verifyToken, verifyUserEnabled, verify_AdminRole], (req, res) => {
    const idReporte = req.params.id;
    const misDatos = { titulo_reporte, desc_reporte, correo_electronico, hora_generar_reporte, tipo_reporte, ind_reporte, tiempo_generar_reporte, mi_archivo } = req.body;
    const dataTokenUser = req.usuarioDB;
    const codeTokenUSer = dataTokenUser.cod_usuario;
    const sqlReportExist = `CALL GetOne_ReportesSinDesplegar(${idReporte})`;
    let sql;
    misDatos.correo_electronico = '';
    misDatos.hora_generar_reporte = ''

    if(verify_sqlInjection(misDatos)){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Intento de SQL Injection no conseguido :D'
            }
        })
    }

    if (!contains_data(titulo_reporte) || !contains_data(desc_reporte) || !contains_data(correo_electronico) || !contains_data(hora_generar_reporte) || !contains_data(tipo_reporte) || !contains_data(ind_reporte) || !contains_data(tiempo_generar_reporte)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Uno de los datos enviados esta incorrecto.'
            }
        })
    }


    if (!verify_FormatTime(hora_generar_reporte)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El formato de hora para generar reporte no es valido. El formato permitido solamente es de 12h'
            }
        })
    }

    if (!validateEmail(correo_electronico)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El correo esta incorrecto, ingrese de nuevo.'
            }
        })
    }

    if (!validate_TypeReportsStatistics(tipo_reporte)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tipo de reporte es incorrecto. Solo puede existir Generado o Guardado'
            }
        })
    }

    if (!validate_StadisticsAndReports_Index(ind_reporte)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El indice de reporte no es valido. Solo puede ser Enabled o Disabled.'
            }
        })
    }

    if (!validate_TimeToGenerate_ReportsStadistics(tiempo_generar_reporte)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'El tiempo de generar reporte esta incorrecto.'
            }
        })
    }

    // let archivo = req.files.archivo;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha selecciondo ningun archivo.'
            }
        });
    }
    let archivo = req.files.mi_archivo;
    let nombreCorto = archivo.name.split('.')
    let extencionArchivo = nombreCorto[nombreCorto.length - 1];

    if (!validate_FormatStadisticsReports(extencionArchivo)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extension de ese archivo no esta permitida.'
            }
        })
    }

    let nombreArchivo = `${codeTokenUSer}-${new Date().getMilliseconds()}.${extencionArchivo}`

    archivo.mv(`./uploads/reportes/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        Conexion.query(sqlReportExist, (err, result) =>{
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
    
            if(!constains_dataDB(result[0])){
                deleteFiles('reportes', nombreArchivo); // <- Que me elimine la imagen
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'No existe ese reporte registrado.'
                    }
                })
            }


            // Imagen ya esta cargada
            let nombreArchivoDB = result[0][0].url_archivo;
            sql = `CALL Upt_Reportes(${idReporte},'${titulo_reporte}', '${desc_reporte}', '${extencionArchivo}', '${nombreArchivo}', '${correo_electronico}', '${hora_generar_reporte}', '${tipo_reporte}', '${ind_reporte}', '${tiempo_generar_reporte}')`
            deleteFiles('reportes', nombreArchivoDB); // <- Que me elimine la imagen y me ponga una nueva en caso de que el reporte si exista
    
            // console.log(sql)
            Conexion.query(sql, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    message: 'Reporte Actualizado con exito!'
                })
            })
        })

    })

})





module.exports = router;

// qwe