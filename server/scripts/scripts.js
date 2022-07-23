const fs = require('fs')
const path = require('path')

// Regular Expresions
const regEX = new RegExp(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/, 'gi') // Para evaluar si hay caracteres especiales
const regEXTime = new RegExp(/^(0?[1-9]|1[0-2]):[0-5][0-9]$/) // Envaluar el formato de Tiempo
const emailRegex = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// Comprobar si con tiene datos un campo
const contains_data = (data) => {
    let myData = data || ''
    if (myData.trim().length > 0) {
        return true;
    }
    return false;
}

const verify_typePhone = (number) => { // Comprueba si el tipo de numero de telefono esta permitido
    if (number === 'F' || number === 'C') {
        return true;
    }
    return false;
}

const verify_phone = (number) => { // Comprueba si el numero de telefono esta permitido
    if (Number(number)) { // Si es un numero
        return true;
    }
    return false;
}

const verify_identity = (number) => {
    if (Number(number) && number.trim().length >= 13 && number.trim().length <= 16) { // Si es un numero
        return true;
    }
    return false;
}


const verify_gender = (gender) => { // Comprueba si el genero esta correcto
    if (gender === 'M' || gender === 'F') {
        return true;
    }
    return false;
}

const verify_payment = (payment) => { // Veritifcar el tipo de pago
    if (payment === 'C' || payment === 'D' || payment === 'E') {
        return true;
    }
    return false;
}

const verify_typeUser = (typeUser) => { // Comprueba si el tipo de usuario es correcto
    if (typeUser === 'User' || typeUser === 'Admin') {
        return true;
    }
    return false;
}


const verify_marital_status = (maritalStatus) => { // Veritifcar el estado civil
    if (maritalStatus === 'S' || maritalStatus === 'C' || maritalStatus === 'D' || maritalStatus === 'V') {
        return true;
    }
    return false;
}

const verify_cant = (cant) => { // Verificar cantidad de algun tipo
    if (cant > 0) {
        return true;
    }
    return false;
}


const constains_dataDB = (result) => { // Ver si vienen datos de la DB
    if (result.length > 0) {
        return true;
    }
    return false;
}



const verify_sqlInjection = (data) => {
    let arr = Object.values(data)
        // console.log(arr);
    const resp = arr.find(element => regEX.test(element) === true)

    if (resp !== undefined) { // Si contiene caracteres para posibles SQL Injection
        return true;
    }
    return false;
}

// reemplazar caracteres especiales SOLAMENTE en las fechas
const replace_DateCharacter = (date) => {
    if (date) {
        const newDate = date.replaceAll('-', ' ') || '' // remplazar
            // console.log(newDate);
        return newDate;
    } else {
        return undefined;
    }
    // console.log(date)
    // console.log(newDate)
}

// Validar Emails
const validateEmail = (email) => {
    if (emailRegex.test(email)) {
        return true;
    } else {
        return false;
    }
}


const verifyUserEnabled = (user) => {
    if (user === 'Enabled') {
        return true;
    }
    return false;
}

const verify_FormatTime = (tiempo) => {
    if (regEXTime.test(tiempo)) {
        return true;
    }
    return false;
}



// Helpers for File Upload
const validateExtensions = (extension) => {
    // Extensiones validas
    const extensionesValidas = ['png', 'jpg', 'pdf'];

    if (extensionesValidas.indexOf(extension) < 0) { // Si NO lo encuentra
        return false;
    }

    return true;
}


const validateTypes = (tipo) => {
    const tiposValidos = ['reportes', 'estadisticas', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) { // Si NO lo encuentra
        return false;
    }

    return true;
}

// Verificar el formato del archivo subido en estadisticas o reportes
const validate_FormatStadisticsReports = (formato) => {
    const tiposValidos = ['docx', 'html', 'xlsx', 'txt', 'text', 'pdf', 'png', 'jpg', 'jpeg'];

    if (tiposValidos.indexOf(formato) < 0) { // Si NO lo encuentra
        return false;
    }

    return true;
}

const validate_FormatImageUser = (formato) => {
    const tiposValidos = ['png', 'jpg', 'jpeg'];

    if (tiposValidos.indexOf(formato) < 0) { // Si NO lo encuentra
        return false;
    }

    return true;
}

// Verifica el tipo de reporte y estadistica
const validate_TypeReportsStatistics = (tipo) => {
    const tiposValidos = ['Generado', 'Guardado'];

    if (tiposValidos.indexOf(tipo) < 0) { // Si NO lo encuentra
        return false;
    }

    return true;
}

// Verifica el indice de las estadisticas y los reportes
const validate_StadisticsAndReports_Index = (indice) => {
    if (indice === 'Enabled' || indice == 'Disabled') {
        return true;
    }
    return false;
}

const StadisticsOrReports_isEnabled = (indice) => { // Verifica si la opcion de generar reporte o estadistica esta habilitada
    if (indice === 'Enabled') {
        return true;
    }
    return false;
}

// Verifica el tiempo de cada cuanto se generara un reporte o estadistica
const validate_TimeToGenerate_ReportsStadistics = (tiempo) => {
    const tiposValidos = ['Diariamente', 'Semanalmente', 'Mensualmente', 'Anualmente'];
    if (tiposValidos.indexOf(tiempo) < 0) { // Si NO lo encuentra
        return false;
    }

    return true;
}


// Para eliminar el archivo (imagen) ya existente
const deleteFiles = (tipo, imgUsuarioDB) => {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${imgUsuarioDB}`)
    if (fs.existsSync(pathImg)) { // Si existe que me la borre
        fs.unlinkSync(pathImg)
    }
}


module.exports = {
    contains_data,
    constains_dataDB,
    verify_sqlInjection,
    replace_DateCharacter,
    verify_typePhone,
    verify_payment,
    verify_cant,
    verify_gender,
    verify_marital_status,
    verify_typeUser,
    validateEmail,
    verify_phone,
    verify_identity,
    verifyUserEnabled,
    validateExtensions,
    validateTypes,
    deleteFiles,
    validate_FormatStadisticsReports,
    validate_TypeReportsStatistics,
    validate_StadisticsAndReports_Index,
    validate_TimeToGenerate_ReportsStadistics,
    verify_FormatTime,
    StadisticsOrReports_isEnabled,
    validate_FormatImageUser,
    regEX,
    regEXTime
}


// qwe