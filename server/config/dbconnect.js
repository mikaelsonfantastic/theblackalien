
const mysql = require('mysql')

let conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'aguamanantialdb',
    password: '',
    port: 3306
})

// Conexion a la DB
conexion.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Conexion Exitosa')
});


module.exports = conexion;


// qwe