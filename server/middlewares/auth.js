
//requires
const jwt = require('jsonwebtoken');

// Verificar el token
const verifyToken = (req, res, next) => {
    const token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) =>{
        if(err) { // En caso de que la informacion sea INCORRECTA
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'Token no valido.'
                }
            })
        }

        req.usuarioDB = decode.usuarioDB;
        next(); 
    });
};

const verifyUserEnabled = (req, res, next) =>{
    let usuario = req.usuarioDB;
    const {estado_usuario} = usuario;
    if(estado_usuario !== 'Enabled'){
        return res.status(401).json({
            ok: false,
            message: 'Este usuario esta desabilidado.'
        })
    }

    next()
}

const verify_AdminRole = (req, res, next) => {

    let usuario = req.usuarioDB; 
    console.log('>> ' , usuario)
    const {tip_usuario} = usuario;

    // console.log(usuario);

    if(tip_usuario !== 'Admin'){ // En caso de que NO sea un admin
        return res.status(401).json({
            ok: false,
            message: 'Este usuario NO es un administrador.'
        })
    }
    next();
};

module.exports = {
    verifyToken,
    verify_AdminRole,
    verifyUserEnabled
}




// qwe