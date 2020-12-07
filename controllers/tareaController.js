const Tarea = require('../models/Tarea.model')
const Proyecto = require('../models/Proyecto.model')
const {validationResult} = require('express-validator')

exports.crearTarea = async(req, res)=>{

        //revisar si hay errores

        const errores = validationResult(req);
        
        if(!errores.isEmpty()){
            return res.status(400).json({errores : errores.array()})
        }

        const {proyecto} = req.body

        try {
            const {proyecto} = req.body

            const proyectoActual = await Proyecto.findById(proyecto)
            if(!proyecto){
                return res.status(404).json({msg: "proyecto no encontrado"})
            }

            //revisar si el proyecto actual pertenece al usuario autenticado

            if(proyectoActual.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'})
        }

            //creamos la tarea

            const tarea = new Tarea(req.body)
            await tarea.save()
            res.json({tarea})
            
        } catch (error) {
            console.log(error)
            res.status(500).send('hubo un error')
        }



}

//obtiene tareas por proyecto
exports.obtenerTareas = async (req, res)=>{


    try {
        const {proyecto} = req.query

        const proyectoActual = await Proyecto.findById(proyecto)
        if(!proyecto){
            return res.status(404).json({msg: "proyecto no encontrado"})
        }
    
        //revisar si el proyecto actual pertenece al usuario autenticado
    
        if(proyectoActual.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg: 'No autorizado'})
        }

        const tareas = await Tarea.find({proyecto}).sort({creado: -1})
        res.json({tareas})

    } catch (error) {
        console.log(error)
        res.status(500). send('hubo un error')
        
    }

   


} 

exports.actualizarTarea = async(req, res) =>{



    try {
        
        const {proyecto, nombre, estado} = req.body

        //si la tarea existe

        let tareaActual = await Tarea.findById(req.params.id)

        if(!tareaActual){
            res.status(404).json({msg : "no existe la tarea"})
        }

        //revisar si el proyecto actual pertenece al usuario autenticado
        const proyectoActual = await Proyecto.findById(proyecto)
        
    
        if(proyectoActual.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg: 'No autorizado'})
        }

        //actualiza la tarea

        const nuevaTarea ={}

        
            nuevaTarea.nombre = nombre
        

        
            nuevaTarea.estado = estado
        

        //guardar tarea

        tareaActual = await Tarea.findByIdAndUpdate({_id : req.params.id}, nuevaTarea, {new : true})
        
        res.json({tareaActual})

    } catch (error) {
        console.log(error)
        res.status(500). send('hubo un error')
        
    }
}

//eliminarTarea
exports.eliminarTarea = async (req, res)=>{

    try {
        
        const {proyecto} = req.query

        //si la tarea existe

        let tareaActual = await Tarea.findById(req.params.id)

        if(!tareaActual){
            res.status(404).json({msg : "no existe la tarea"})
        }

        //revisar si el proyecto actual pertenece al usuario autenticado
        const proyectoActual = await Proyecto.findById(proyecto)
        
    
        if(proyectoActual.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg: 'No autorizado'})
        }

        

        //eliminar tarea

         await Tarea.findByIdAndDelete({_id : req.params.id})
        
        res.json({msg: "tarea eliminada"})

    } catch (error) {
        console.log(error)
        res.status(500). send('hubo un error')
        
    }
}