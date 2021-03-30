const mongoose = require('mongoose');

const throatSchema = mongoose.Schema({
    _id: String,
    patient_id: String,
    supervisor_doctor:String,
    mri_image: String,
    mask_image: String
});

module.exports = mongoose.model('throat', throatSchema);
