
const Usuario = require('../models/Usuario.model')
const bcrypt = require("bcrypt")
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')

exports.loginUsuario = async (req,res) =>{

            //revisar si hay errores

            const errores = validationResult(req);
        
            if(!errores.isEmpty()){
                return res.status(400).json({errores : errores.array()})
            }
    
        const {email, password} = req.body


        try{

            let usuario = await Usuario.findOne({email});
            if (!usuario){
                return res.status(400).json({msg: "el usuario no existe"})
            }

            const passCorrecto = await bcrypt.compareSync(password, usuario.password)
            if (!passCorrecto) {
                return res.status(400).json({msg: "Password Incorrecto"})
            }

            const payload = {
                usuario: {
                    id: usuario.id
                }
            }
    
            jwt.sign(payload, `${process.env.SECRET}`, {
                expiresIn: 3600
            }, (error, token)=>{
                if(error) throw error;
    
                //mensaje de confirmación
    
                res.json({token})
            })



        } catch (error){
            console.log(error)
        }

}

exports.usuarioAutenticado = async (req, res) =>{

    try {

        const usuario = await Usuario.findById(req.usuario.id).select('-password')
        res.json({usuario})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Hubo un error'})
    }

}