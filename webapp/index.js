const express = require("express");
const app= express();
const bodyParser= require("body-parser");
const URLS = require('./baseUrls');
const fetch = require("node-fetch");
var exphbs  = require('express-handlebars');
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(bodyParser.urlencoded("extended: true"))
app.use(express.static("public"));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(cookieParser());

var hbs = exphbs.create({});

app.get("/start", function(req,res){
  res.clearCookie('user');
  res.clearCookie('token');
  res.sendFile(__dirname + "/HTML/startPage.html");
});

app.get("/", (req, res) => {
  res.clearCookie('user');
  res.clearCookie('token');
  res.sendFile(__dirname + "/HTML/index.html");
});

/* -------------- PATIENT ROUTES ---------------- */

app.get("/patient/register",function(req,res){
  res.sendFile(__dirname+"/HTML/Patient_Register.html");
});

app.post("/patient/register", async (req,res) => {
  const body = {
    _id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    token: req.body.token
  }

  const requestOption = {
    method: "POST",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify(body)
  }

  console.log(body);
  console.log(`${URLS.SERVER_URL}/patient/register/`);
  const rawResponse = await fetch(`${URLS.SERVER_URL}/patient/register/`, requestOption)
  const data = await rawResponse.json();
  console.log(data);
  if(data.message === "New Patient Created"){
    console.log("New Patient Created");
    res.redirect('/patient');
  } else {
    res.redirect("/");
  }

});

app.get("/patient", (req,res) => {
  res.clearCookie('user');
  res.clearCookie('token');
  res.sendFile(__dirname+"/HTML/Patient_login.html");
});

app.post("/patient", async (req,res) => {
  const body = {
    _id: `${req.body.id}`,
    token: `${req.body.token}`
  }
  // console.log(body);
  const requestOption = {
    method: "POST",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify(body)
  }

  // console.log(requestOption);

  const rawResponse = await fetch(`${URLS.SERVER_URL}/patient/login/`, requestOption)
  const data = await rawResponse.json();

  // console.log(data);

  if(data.message === 'Auth Successful'){
    res.cookie('token', "token " + data.token);
    res.cookie('user', req.body.id);
    res.redirect(`/patient/dashboard/${req.body.id}`)
  } else {
    res.redirect("/");
  }

});

app.get("/patient/dashboard/:id", async (req,res) => {
  const token = req.cookies.token || ''  ;
  const requestOption = {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": token
    }
  }
  const rawResponse = await fetch(`${URLS.SERVER_URL}/patient/dashboard/${req.params.id}/`, requestOption);
  const data = await rawResponse.json();
  res.render('patient_dash', {layout: 'patient.handlebars' ,data: data})

})

/* -------------- DOCTOR ROUTES ---------------- */
app.get("/doctor",function(req,res){
  res.clearCookie('user');
  res.clearCookie('token');
  res.sendFile(__dirname+"/HTML/Doctor_login.html");
});

app.post("/doctor", async (req, res) =>{
  const body = {
    _id: `${req.body.id}`,
    token: `${req.body.token}`
  }
  const requestOption = {
    method: "POST",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify(body)
  }

  console.log(requestOption);

  const rawResponse = await fetch(`${URLS.SERVER_URL}/doctor/login/`, requestOption)
  const data = await rawResponse.json();
  console.log(data);
  if(data.message === 'Auth Successful'){
    res.cookie('token', "token " + data.token);
    res.cookie('user', req.body.id);
    res.redirect(`/doctor/dashboard/${req.body.id}`)
  } else {
    res.redirect("/");
  }

});

app.get("/doctor/dashboard/:id", async(req,res) => {
    const token = req.cookies.token || ''  ;
    const requestOption = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Authorization": token
      }

    }

    const rawResponse = await fetch(`${URLS.SERVER_URL}/doctor/dashboard/${req.params.id}/`, requestOption);
    const data = await rawResponse.json();
    console.log(data);
    res.render('home', data
     // Doctor_id: req.cookies.user}
  );
})

// FORMAT OF JSON FOR API TO BE CALLED IN BELOW ROUTE

// {
//   "did": "DID02",
//   "pid": "PID01",
//   "test": {
//               "title": "diabetes",
//               "id": "DIA01",
//               "details":{
//                           "Pregnancies": 1,
//                           "Glucose": 89,
//                           "BloodPressure": 66,
//                           "SkinThickness": 23,
//                           "Insulin": 94,
//                           "BMI": 28.1,
//                           "DiabetesPedigreeFunction": 0.167,
//                           "Age": 21
//                       }
//           }
//
// }

app.post("/doctor/dashboard/:id", async(req,res) => {
  if(req.body.addDisease==="Cancer"){
      var obj={
        "did": req.params.id,
        "pid": req.body.Patient_name,
        "test": {
                    "title": "cancer",
                    "id": req.body.dis_id,
                    "details":{
                                "radius_mean" : req.body.Radius_mean,
                                "perimeter_mean": req.body.Perimeter_mean ,
                                "area_mean": req.body.Area_mean,
                                "concavity_mean": req.body.Concavity_mean,
                                "concave_points_mean": req.body.Concave_points_mean,
                                "radius_se": req.body.Radius_se,
                                "area_se": req.body.Area_se,
                                "radius_worst": req.body.Radius_worst,
                                "texture_worst": req.body.Texture_worst,
                                "perimeter_worst": req.body.Perimeter_worst,
                                "area_worst": req.body.Area_worst,
                                "compactness_worst": req.body.Compactness_worst,
                                "concavity_worst": req.body.Concavity_worst,
                                "concave_points_worst": req.body.Concave_points_worst
                            }
                }

      };
  }
  else if(req.body.addDisease==="Heart Disease"){
    var obj={
      "did": req.params.id,
      "pid": req.body.Patient_name,
      "test": {
                  "title": "heart",
                  "id": req.body.dis_id,
                  "details":{
                              "age" : req.body.Age,
                              "sex": req.body.Sex,
                              "cp": req.body.CP,
                              "trestbps": req.body.Trestbps,
                              "chol": req.body.Chol,
                              "fbs": req.body.FBS,
                              "restecg": req.body.RestECG,
                              "thalach": req.body.Thalach,
                              "exang": req.body.Exang,
                              "oldpeak": req.body.Old_peak,
                              "slope": req.body.Slope,
                              "ca": req.body.CA,
                              "thal": req.body.Thal
                          }
              }

    };
  }
  else if(req.body.addDisease==="Diabetes"){
    var obj={
      "did": req.params.id,
      "pid": req.body.Patient_name,
      "test": {
                  "title": "diabetes",
                  "id": req.body.dis_id,
                  "details":{
                              "Pregnancies" :req.body.Pregnancies ,
                              "Glucose" :req.body.Glucose,
                              "BloodPressure" :req.body.Blood_Pressure,
                              "SkinThickness" :req.body.Skin_Thickness,
                              "Insulin" :req.body.Insulin,
                              "BMI" :req.body.BMI,
                              "DiabetesPedigreeFunction" :req.body.Diabetes_Pedigree_Function,
                              "Age" :req.body.Age
                          }
              }

    };
  }
  else{
      var image=req.body.throat_photo;

      var array = image.split(".");

      var image_title= array[0];
      var obj={
        "did": req.params.id,
        "pid": req.body.Patient_name,
        "test": {
                  "title": "throat-tumor",
                  "id": req.body.dis_id,
                  "details":{
                              "title": image_title
                          }
              }
      };
  }
  const token = req.cookies.token || ''  ;
  const requestOption = {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify(obj)
  }

  console.log(requestOption);

  const rawResponse = await fetch(`${URLS.SERVER_URL}/doctor/dashboard/${req.params.id}/`, requestOption);
  const data = await rawResponse.json();
  // console.log(data);
  res.redirect(`/doctor/dashboard/${req.params.id}`)
  // res.render('home', data);

});

app.get("/doctor/dashboard/:title/:disease_id", async (req,res) => {
  const token = req.cookies.token || ''  ;
  const user = req.cookies.user || ''  ;
  const disease_title = req.params.title;
  const disease_id = req.params.disease_id;

  const requestOption = {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": token
    }
  }
  const rawResponse = await fetch(`${URLS.SERVER_URL}/doctor/dashboard/${user}/`, requestOption);
  const data = await rawResponse.json();

  let data_transfer;

  const pd = data.patient_details;
  for(var i=0;i<pd.length;i++){
    for(var j=0;j<pd[i].tests.length;j++){
      if(pd[i].tests[j].title === disease_title && pd[i].tests[j].id === disease_id){
        data_transfer = pd[i].tests[j];
      }
    }
  }
  console.log(data_transfer);
  res.render('patient_details',{layout: 'details.handlebars' ,data: data_transfer})
})

app.get("/patient/dashboard/:title/:disease_id", async (req,res) => {
  const token = req.cookies.token || ''  ;
  const user = req.cookies.user || ''  ;
  const disease_title = req.params.title;
  const disease_id = req.params.disease_id;

  const requestOption = {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "Authorization": token
    }
  }
  const rawResponse = await fetch(`${URLS.SERVER_URL}/patient/dashboard/${user}/`, requestOption);
  const data = await rawResponse.json();

  let data_transfer;

  const pd = data.tests;

  for(var i=0;i<pd.length;i++){
      if(pd[i].title === disease_title && pd[i].id === disease_id){
        data_transfer = pd[i];
    }
  }
  console.log(data_transfer);
  res.render('patient_details',{layout: 'details.handlebars' ,data: data_transfer})
})


hbs.handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});



app.listen(4200,function(){
  console.log("WebApp is running at port 4200");
})
