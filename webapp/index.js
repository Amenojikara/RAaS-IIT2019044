const express = require("express");
const bodyParser= require("body-parser");
const superagent = require('superagent');
const https= require("https");
const app= express();
const URLS = require('./baseUrls');
const fetch = require("node-fetch");
var exphbs  = require('express-handlebars');

app.use(bodyParser.urlencoded("extended: true"))
app.use(express.static("public"));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


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
  console.log(req.body);
  const body = {
    _id: `${req.body.id}`,
    token: `${req.body.token}`
  }
  const requestOption = {
    method: "POST",
    headers: {"Content-type": "application/json"},
    body: JSON.stringify(body)
  }

  console.log(requestOption)

  const rawResponse = await fetch(`${URLS.SERVER_URL}/doctor/login/`, requestOption)
  const data = await rawResponse.json();
  console.log(data);
  if(data.message == "Auth Successful"){
    res.redirect(`/doctor/dashboard/${req.body.id}`)
  } else {
    // res.redirect(`/doctor/dashboard/${req.body.id}`)
    res.redirect("/");
  }

});

app.get("/doctor/dashboard/:id", async(req,res) => {

    const rawResponse = await fetch(`${URLS.SERVER_URL}/doctor/dashboard/${req.params.id}/`);
    const data = await rawResponse.json();
    console.log(data);
    res.render('home', data);
})

app.post("/doctor/dashboard/", async(req,res) => {
  console.log(req.body);
})

app.listen(4200,function(){
  console.log("WebApp is running at port 4200");
})
