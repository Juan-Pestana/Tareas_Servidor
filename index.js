require('dotenv').config()
require ('./config/db')

const cors = require('cors')

const express = require('express');

//crear servidor

const app = express();

//habilitar CORS
const whitelist = [process.env.DOMAIN_LOCAL, process.env.DOMAIN_REMOTE]
const corsOptions = {
    origin: (origin, cb) => {
        const originIsWhitelisted = whitelist.includes(origin)
        cb(null, originIsWhitelisted)
    },
    credentials: true
}

app.use(cors())

//Habilitar express.json

app.use(express.json({extended : true}));



//PUETO DE LA APP
const port = process.env.port || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/user.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/proyecto', require('./routes/proyecto.routes'));
app.use('/api/tareas', require('./routes/tareas.routes'));


//arrancando la app
app.listen(port, '0.0.0.0', () =>{
    console.log(`el servidor está funcionando en el puerto ${port}`)
})