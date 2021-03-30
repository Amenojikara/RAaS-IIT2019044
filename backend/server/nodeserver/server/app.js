const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Importing routes
const patientRoutes = require('./api/routes/patients');
const doctorRoutes = require('./api/routes/doctors');

// Connecting to mongoose db
mongoURI = 'mongodb+srv://'+ process.env.DB_USER + ':' + process.env.DB_PASS  + '@cluster0.k1jax.mongodb.net/soeDB?retryWrites=true&w=majority';
mongoose.connect(
    mongoURI,
    {useNewUrlParser: true,  useUnifiedTopology: true}
);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise; // To remove Deprication Warning

// CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(res.method === "OPTIONS") {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'    
        )
        return res.statusMessage(200).json({});
    }
    next();
});

// Routing
app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);

// Handling errors
app.use((req, res, next) => {
    const error = new Error("Not found (Custom)");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status);
    res.json({
        message: error.message
    })
});



module.exports = app;