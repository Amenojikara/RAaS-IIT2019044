const mongoose = require('mongoose');

const heartSchema = mongoose.Schema({
    _id: String,
    patient_id: String,
    supervisor_doctor:String,
    details: {
        age: Number,
        sex: Number,
        cp: Number,
        trestbps: Number,
        chol: Number,
        fbs: Number,
        restecg: Number,
        thalach: Number,
        exang: Number,
        oldpeak: Number,
        slope: Number,
        ca: Number,
        thal: Number,
    },
    prediction: Number
});

module.exports = mongoose.model('heart', heartSchema);
