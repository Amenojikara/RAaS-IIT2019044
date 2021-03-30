const mongoose = require('mongoose');

const cancerSchema = mongoose.Schema({
    _id: String,
    patient_id: String,
    supervisor_doctor:String,
    details: {
        radius_mean: Number,
        perimeter_mean: Number,
        area_mean: Number,
        concavity_mean: Number,
        concave_points_mean: Number,
        radius_se: Number,
        area_se: Number,
        radius_worst: Number,
        texture_worst: Number,
        perimeter_worst: Number,
        area_worst: Number,
        compactness_worst: Number,
        concavity_worst: Number,
        concave_points_worst: Number,
    },
    prediction: Number
    
    
});

module.exports = mongoose.model('cancer', cancerSchema);
