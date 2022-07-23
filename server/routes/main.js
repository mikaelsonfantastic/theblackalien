
const express = require('express')
const app = express()

// paises
app.use(require('./direcciones/set_pais'))

// depto
app.use(require('./direcciones/set_depto'))

// municipio
app.use(require('./direcciones/set_municipio'))

// marcas
app.use(require('./marcas/set_marcas'))

// distribucion
app.use(require('./distribucion/set_distribucion'))

// inventario
app.use(require('./inventario/set_inventario'))

// empresa
app.use(require('./empresa/set_empresa'))

// pedido
app.use(require('./pedidos/set_pedidos'))

// usuarios
app.use(require('./usuarios/set_usuarios'))

// login
app.use(require('./login/login'))

// test upload
app.use(require('./upload'))

// reportes
app.use(require('./reportes/set_reportes'))



module.exports = app;


// qwe