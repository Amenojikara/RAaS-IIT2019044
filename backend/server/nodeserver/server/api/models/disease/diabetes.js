const mongoose = require('mongoose');

const diabetesSchema = mongoose.Schema({
    _id: String,
    patient_id: String,
    supervisor_doctor:String,
    details: {
        Pregnancies: Number,
        Glucose: Number,
        BloodPressure: Number,
        SkinThickness: Number,
        Insulin: Number,
        BMI: Number,
        DiabetesPedigreeFunction: Number,
        Age: Number
    },
    prediction: Number    
});

module.exports = mongoose.model('diabetes', diabetesSchema);
