const express=require("express");
const bodyParser= require("body-parser");
const superagent = require('superagent');
const https= require("https");
const app= express();
app.use(bodyParser.urlencoded({extended: true}));

var exphbs  = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/fuck', function (req, res) {
    res.render('home');
});



app.get("/",function(req,res){
  res.sendFile(__dirname+"/HTML/startPage.html");
});
app.get("/Patient_login.html",function(req,res){
  res.sendFile(__dirname+"/HTML/Patient_login.html");
});
app.get("/Patient_Register.html",function(req,res){
  res.sendFile(__dirname+"/HTML/Patient_Register.html");
});
app.get("/Doctor_login.html",function(req,res){
  res.sendFile(__dirname+"/HTML/Doctor_login.html");
});
app.get("/Doctor_dashboard.html",function(req,res){
  res.sendFile(__dirname+"/HTML/Doctor_dashboard.html");
});
app.get("/Patient_dashboard.html",function(req,res){
  res.sendFile(__dirname+"/HTML/Patient_dashboard.html");
});

app.get("/doctor/:id",function(req,res){
  //res.send(req.params.id);


// callback
superagent
  .get('https://cb90c9404cfd.ngrok.io/doctor/dashboard/'+req.params.id)
  // .get('http://localhost:4200/Doctor_dashboard.html')
  // .send({ name: 'Manny', species: 'cat' }) // sends a JSON post body
  // .set('X-API-Key', 'foobar')
  // .set('accept', 'json')
  .end((err, response) => {
    // Calling the end function will send the request
    // res.send(response);
    console.log(JSON.parse(response.text))
    res.render('home', JSON.parse(response.text))
  });
})

app.use(express.static("public"));




app.listen(4200,function(){
  console.log("server is running at port 4200");
})
