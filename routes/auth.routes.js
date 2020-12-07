//ruta para autenticar usuario
const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController')
const {check} = require('express-validator')
const auth = require('../middleware/auth')

//loguea un usuario
//api/auth
router.post('/', 
    [
        check('email', 'Agrega un Email válido').isEmail(),
        check('password', 'El password debe ser de al menos 6 caracteres').isLength({min:6})
    ],

    authController.loginUsuario

);

//obtiene el usuario autenticado
router.get('/',
    auth,
    authController.usuarioAutenticado

)

module.exports = router