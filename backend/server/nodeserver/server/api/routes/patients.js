const express = require('express');
const app = express();
const router = express.Router();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const Patient = require('../models/patient');
const Diabetes = require('../models/disease/diabetes');
const Cancer = require('../models/disease/cancer');
const Heart = require('../models/disease/heart');
const Throat = require('../models/disease/throat');
const patient_auth = require('../middleware/patient-check-auth');

const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors());
app.use(cookieParser());

router.post('/register', (req, res, next) => {
    Patient.find({_id: req.body._id})
        .exec()
        .then(patient => {
            console.log("hello", patient.length);
            if(patient.length >= 1){
                return res.status(409).json({
                    message: "Patient Already Exists!"
                });
            } else {
                bcrypt.hash(req.body.token, 10, (err, hash) => {
                    if(err){
                        return res.status(500).json({error: err, auth: "One"});
                    } else {
                        const user = new Patient({
                            _id: req.body._id,
                            name: req.body.name,
                            email: req.body.email,
                            token: hash
                        })
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: "New Patient Created"
                                });
                            })
                            .catch(err => {
                                res.status(500).json({error: err, auth: "Two"});
                            })
                    }
                })
            }
        })
        .catch(err => res.status(404).json({error: err, auth: "Outer"}))
});

router.post('/login', (req, res, next) => {
        Patient.find({_id: req.body._id})
        .exec()
        .then(user => {
            if(user.length < 1){
                return res.status(401).json({
                    message: "Auth Failed"
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

router.get('/profile/:id', async (req, res,next) => {
    const p = await Patient.find({_id: req.params.id}); //.select('_id name email');
    console.log(p);
    res.status(200).json(p);
        
});

router.get('/dashboard/:id', patient_auth, async (req, res, next) => {
    const pid = req.params.id

    let v = await Patient.findOne({_id: pid});
    if(v === null){
        res.status(404).json({message:"Patient: not found!"});
    }
    testArray = v.tests;

    let ptd = []

    for(let i=0 ; i<testArray.length ; i++){
        if(testArray[i].title === "heart"){
            let ret = await Heart.findOne({_id: testArray[i]._id});
            const resp = {
                title: "heart",
                id: testArray[i]._id,
                supervisor_doctor: testArray[i].supervisor_doctor,
                details: ret.details,
                prediction: ret.prediction
            };
            ptd.push(resp);
        }
        else if(testArray[i].title === "cancer"){
            let ret = await Cancer.findOne({_id: testArray[i]._id});
            const resp = {
                title: "cancer",
                id: testArray[i]._id,
                supervisor_doctor: testArray[i].supervisor_doctor,
                details: ret.details,
                prediction: ret.prediction
            };
            ptd.push(resp);
            
        }
        else if(testArray[i].title === "diabetes"){
            
            let ret = await Diabetes.findOne({_id: testArray[i]._id});
            const resp = {
                title: "diabetes",
                id: testArray[i]._id,
                supervisor_doctor: testArray[i].supervisor_doctor,
                details: ret.details,
                prediction: ret.prediction
            };
            ptd.push(resp);
        }
        else if(testArray[i].title === "throat-tumor"){
            let ret = await Throat.findOne({_id: testArray[i]._id});
            const resp = {
                title: "throat-tumor",
                id: testArray[i]._id,
                supervisor_doctor: testArray[i].supervisor_doctor,
                details: {
                    mri_image: ret.mri_image,
                    mask_image: ret.mask_image
                }
            }
            ptd.push(resp);
        }
    }
    
    const response = {
        _id: v._id,
        name: v.name,
        email: v.email,
        tests: ptd
    }    
    res.status(200).json(response);

})

module.exports = router;