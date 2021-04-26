const express = require("express");
const bodyParser= require("body-parser");
const superagent = require('superagent');
const https= require("https");
const app= express();
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

app.get("/", function(req,res){
  res.sendFile(__dirname + "/HTML/startPage.html");
});


app.get("/patient",function(req,res){
  res.sendFile(__dirname+"/HTML/Patient_login.html");
});

app.get("/patient/register",function(req,res){
  res.sendFile(__dirname+"/HTML/Patient_Register.html");
});

app.get("/patient/dashboard",function(req,res){
  res.sendFile(__dirname+"/HTML/Patient_dashboard.html");
});

app.get("/doctor",function(req,res){
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

  // console.log(requestOption)

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
    // console.log(data);
    res.render('home', data);
})



app.get("/patient/:id",function(req,res){
  //res.send(req.params.id);


// callback
superagent
  .get('http://localhost:3000/patient/dashboard/'+req.params.id)
  // .get('http://localhost:4200/Doctor_dashboard.html')
  // .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
  // .set('X-API-Key', 'foobar')
  // .set('accept', 'json')
  .end((err, response) => {
    // Calling the end function will send the request
    // res.send(response);
    console.log(JSON.parse(response.text))
    res.render('patient_dash', {layout: 'patient.handlebars' ,data: JSON.parse(response.text)})
  });
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
  if(req.body.addDisease=="Cancer"){
      var obj={
        "did": req.params.id,
        "pid": req.body.Patient_name,
        "test": {
                    "title": "cancer",
                    "id": req.body.dis_id,
                    "details":{
                                "Radius_mean" : req.body.Radius_mean,
                                "Perimeter_mean": req.body.Perimeter_mean ,
                                "Area_mean": req.body.Area_mean,
                                "Concavity_mean": req.body.Concavity_mean,
                                "Concave_points_mean": req.body.Concave_points_mean,
                                "Radius_se": req.body.Radius_se,
                                "Area_se": req.body.Area_se,
                                "Radius_worst": req.body.Radius_worst,
                                "Texture_worst": req.body.Texture_worst,
                                "Perimeter_worst": req.body.Perimeter_worst,
                                "Area_worst": req.body.Area_worst,
                                "Compactness_worst": req.body.Compactness_worst,
                                "Concavity_worst": req.body.Concavity_worst,
                                "Concave_points_worst": req.body.Concave_points_worst
                            }
                }

      };
  }
  else if(req.body.addDisease=="Heart Disease"){
    var obj={
      "did": req.params.id,
      "pid": req.body.Patient_name,
      "test": {
                  "title": "heart",
                  "id": req.body.dis_id,
                  "details":{
                              "Age" : req.body.Age,
                              "Sex": req.body.Sex,
                              "CP": req.body.CP,
                              "Trestbps": req.body.Trestbps,
                              "Chol": req.body.Chol,
                              "FBS": req.body.FBS,
                              "RestECG": req.body.RestECG,
                              "Thalach": req.body.Thalach,
                              "Exang": req.body.Exang,
                              "Old_peak": req.body.Old_peak,
                              "Slope": req.body.Slope,
                              "CA": req.body.CA,
                              "Thal": req.body.Thal
                          }
              }

    };
  }
  else if(req.body.addDisease=="Diabetes"){
    var obj={
      "did": req.params.id,
      "pid": req.body.Patient_name,
      "test": {
                  "title": "diabetes",
                  "id": req.body.dis_id,
                  "details":{
                              "Pregnancies" :req.body.Pregnancies ,
                              "Glucose" :req.body.Glucose,
                              "Blood_Pressure" :req.body.Blood_Pressure,
                              "Skin_Thickness" :req.body.Skin_Thickness,
                              "Insulin" :req.body.Insulin,
                              "BMI" :req.body.BMI,
                              "Diabetes_Pedigree_Function" :req.body.Diabetes_Pedigree_Function,
                              "Age" :req.body.Age
                          }
              }

    };
  }
  else{
      var image=req.body.throat_photo;
      // console.log(typeof(image));
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

  // console.log(requestOption);

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
})



app.listen(4200,function(){
  console.log("WebApp is running at port 4200");
})
