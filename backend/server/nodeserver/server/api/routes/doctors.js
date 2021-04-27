const express = require('express');
const app = express();
const router = express.Router();
const fetch = require("node-fetch");
const cors = require('cors');
const cookieParser = require('cookie-parser');

const Patient = require('../models/patient');
const Doctor = require('../models/doctor');
const helper = require('../middleware/helper');
const URLS = require('../../baseUrls');
const doctor_auth = require('../middleware/doctor-check-auth');

const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens

app.use(express.json());
app.use(cors());
app.use(cookieParser());

router.post('/register', (req, res, next) => {
    Doctor.find({_id: req.body._id})
        .exec()
        .then(doctor => {
            if(doctor.length >= 1){
                return res.status(409).json({
                    message: "Doctor Already Exists!"
                });
            } else {
                bcrypt.hash(req.body.token, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({error: err});
                    } else {
                        const user = new Doctor({
                            _id: req.body._id,
                            name: req.body.name,
                            email: req.body.email,
                            token: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "New Doctor Created"
                                });
                            })
                            .catch(err => {
                                res.status(500).json({error: err});
                            });
                    }
                })        
            }
        })
        // .catch(err => res.status(404).json({error: err}))
});

router.post('/login', (req, res, next) => {
    Doctor.find({_id: req.body._id})
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message: "Auth Failed",
                    data: req.body
                });

            }
            bcrypt.compare(req.body.token, user[0].token, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: "Auth Failed"
                    });
                }
                if(result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        "secret",
                        {
                            expiresIn: "1h"
                        }
                    );

                    return res.status(200).json({
                        message: "Auth Successful",
                        token: token
                    })
                }
                res.status(401).json({
                    message: "Auth Failed",
                });
            })
        })
        .catch(err => res.status(500).json({error: err}));
});

router.get('/profile/:id', (req, res, next) => {
    const did = req.params.id;
    Doctor.find({_id: did})
        .select('_id name email patients')
        .exec()
        .then( user => {
            return res.status(200).json(user);
        })
        .catch(err => res.status(500).json({error: err}));
})

/*

{
    "did": "DID02",
    "pid": "PID02",
    "test": {
                "title": "diabetes",
                "id": "DIA01",
                "details":{
                            "x": 1,
                            "y": 2,
                            "z": 3,
                            "prediction": 4
                          }
            }

}

*/

router.get('/dashboard/:id', doctor_auth, async (req,res, next) => {
    const did = req.params.id;
    const token = req.headers.authorization;
    
    // console.log(req.headers, token)

    let doc = await Doctor.findOne({_id: did});
    if(doc === null){
        return res.status(404).json({message:"Doctor not found!"});
    }
    let patients = doc.patients;
    let patient_details = []

    for(var i=0 ; i<patients.length ; i++){
        requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": token
            }
        }
        const rawResponse = await fetch(`${URLS.PATIENT_DATA_URL}/dashboard/${patients[i]}/`, requestOptions);
        const data = await rawResponse.json();
        console.log(data);
        data.tests = data.tests.filter(test => {
            if(test.supervisor_doctor){
                return test.supervisor_doctor === did ;
            } else {
                return false;
            }
        });
        // console.log(data);
        patient_details.push(data);            

    }

    const response = {
        doctor_id: req.params.id,
        patient_details: patient_details
    }

    return res.status(200).json(response);

})

router.patch('/dashboard/:id', doctor_auth, async (req, res, next) => {
    const did = req.params.id;
    const pid = req.body.pid;
    const test = req.body.test;
    // console.log(did, pid, test);
    
    // Updating Doctor Schema
    await Doctor.find({_id: did, patients: pid}, (err, found) => {
        // console.log(found)
        if(err){
            return res.status(400).json({error: err});
        }
        if(found.length === 0){
            Doctor.updateOne({_id: did}, {$push: {patients: pid}} )
                    .exec()
                    .then()
                    .catch(err => {return res.status(500).json({error: err})});
        }
    })

    // Updating Patient Schema

    await Patient.find({'tests._id': test.id}, (err, found) => {
        if(err){
            return res.status(400).json({error: err});
        }
        if(found.length === 0 ){
            const patientTestDetails = {
                title: test.title,
                _id: test.id,
                supervisor_doctor: did,
            }
            Patient.updateOne({_id: pid}, {$push: {tests: patientTestDetails}})
                    .exec()
                    .then()
                    .catch(err => {return res.status(500).json({eoor: err})});

        }

    })


    // Updating Disease Database
    if(test.title === "diabetes"){
        const ret = await helper.diabetes_post(test, did, pid);
    }
    else if(test.title === "cancer"){
        const ret = await helper.cancer_post(test, did, pid);
    }
    else if(test.title === "heart"){
        const ret = await helper.heart_post(test, did, pid);
    }
    else if(test.title === "throat-tumor"){
        const ret = await helper.throat_post(test, did, pid);
    }

    return res.status(200).json({
        message: "Data stored successfully!"
    })



});



module.exports = router;
