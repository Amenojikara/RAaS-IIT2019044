const fetch = require("node-fetch");

const Cancer = require('../models/disease/cancer');
const Diabetes = require('../models/disease/diabetes');
const Heart = require('../models/disease/heart');
const Throat = require('../models/disease/throat');
const URLS = require('../../baseUrls');

const getPrediction = async (test) => {
    console.log(test);
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(test.details)
    }
    console.log(`${URLS.BASE_URL}/${test.title}/`);
    const rawResponse = await fetch(`${URLS.BASE_URL}/${test.title}/`, requestOptions);   

    // const rawResponse = await axios({
    //     method: 'post',
    //     url: `${URLS.BASE_URL}/${test.title}/`,
    //     data: JSON.stringify(test.details),
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // }); 
    
    console.log(rawResponse);
    const data = await rawResponse.json();
    console.log(data);
    return data.prediction
};

// Cancer GET/POST
exports.cancer_post = async (test, did, pid) => {
    
    const pred = await getPrediction(test);
    const cancer = new Cancer({
        _id: test.id,
        patient_id: pid,
        supervisor_doctor: did,
        details: test.details,
        prediction: pred
    })
    cancer.save()
    return 0;
};

// Diabetes GET/POST
exports.diabetes_post = async (test, did, pid) => {

    const pred = await getPrediction(test);
    const diabetes = new Diabetes({
        _id: test.id,
        patient_id: pid,
        supervisor_doctor: did,
        details: test.details,
        prediction: pred
    })
    diabetes.save()
    return 0;
};

// Heart GET/POST
exports.heart_post = async (test, did, pid) => {

    const pred = await getPrediction(test);

    const heart = new Heart({
        _id: test.id,
        patient_id: pid,
        supervisor_doctor: did,
        details: test.details,
        prediction: pred
    })
    heart.save()
};

// Throat GET/POST
exports.throat_post = async (test, did, pid) => {

    const result = await getPrediction(test);
    const throat = new Throat({
        _id: test.id,
        patient_id: pid,
        supervisor_doctor: did,
        mri_image: result.mri_image,
        mask_image:result.mask_image
    })
    throat.save()
};