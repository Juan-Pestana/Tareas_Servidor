const Usuario = require('../models/Usuario.model')
const bcrypt = require("bcrypt")
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')

exports.crearUsuario = async (req, res) =>{

        //revisar si hay errores

        const errores = validationResult(req);
        
        if(!errores.isEmpty()){
            return res.status(400).json({errores : errores.array()})
        }

    const {email, password} = req.body

    
    try{
         

        let usuario = await Usuario.findOne({email})

        if (usuario){
            return res.status(400).json({msg: "el usuario ya existe"})
        }

        //crear Usuario
        usuario = new Usuario(req.body)

        //hashear password
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(password, salt);

        usuario.password = hashPass

        //guardar usuario 

        await usuario.save()

              
        //crear y firmar jwt

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
    } catch(error){

        console.log(error)
        res.status(400).json({msg: "Hubo un error"})
    }

}