const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
    
    _id: String,
    
    name: {type: String, required: true},
    
    email: {
        type: String, 
        required: true, 
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    
    token: {type: String, required: true},
    
    tests: [
        {
            _id: String, // DIA01, HRT01, 
            title: String, // heart, diabetes, 
            supervisor_doctor: String, // DID01, DID01
            time: {type: Date, default: Date.now} //
        }
    ]
});

module.exports = mongoose.model('Patient', patientSchema);
