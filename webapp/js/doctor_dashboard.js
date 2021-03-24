function addNewPatient(){
  var element=document.querySelectorAll(".row .col-12");
  if(element.length%2==0){
    document.querySelectorAll('')
  }
}

// function populate(s1,s2){
  var s1= document.getElementById("addDisease");
  var s2= document.getElementById("detailDisease");

  s1.addEventListener('change',function(){
    s2.innerHTML="";
    var selected_option= this.value;
    if(selected_option =="Cancer"){



  //
  var fields=["Radius_mean","Perimeter_mean","Area_mean","Concavity_mean","Concave_points_mean","Radius_se","Area_se","Radius_worst","Texture_worst","Perimeter_worst","Area_worst","Compactness_worst","Concavity_worst","Concave_points_worst"];
  var i=1;
  for(i=0;i<fields.length;i++){
    var list = document.createElement("LI");
  var lab= document.createElement("LABEL");
  var textnode = document.createTextNode(fields[i]+":- ");
   lab.appendChild(textnode);
  var node=document.createElement("INPUT");
  node.type="number";
  list.appendChild(lab);
  document.getElementById("detailDisease").appendChild(list);
  list.appendChild(node);
  document.getElementById("detailDisease").appendChild(list);
  }
    }
    else if(selected_option =="Diabetes"){
      var fields=["Pregnancies","Glucose","Blood Pressure","Skin Thickness","Insulin","BMI","Diabetes Pedigree Function","Age"];
      var i=1;
      for(i=0;i<fields.length;i++){
        var list = document.createElement("LI");
      var lab= document.createElement("LABEL");
      var textnode = document.createTextNode(fields[i]+":- ");
       lab.appendChild(textnode);
      var node=document.createElement("INPUT");
      node.type="number";
      list.appendChild(lab);
      document.getElementById("detailDisease").appendChild(list);
      list.appendChild(node);
      document.getElementById("detailDisease").appendChild(list);
      }
    }


    else if(selected_option =="Heart Disease"){
      var fields=["Age","Sex","CP","Trestbps","Chol","FBS","RestECG","Thalach","Exang","Old peak","Slope","CA","Thal"];
      var i=1;
      for(i=0;i<fields.length;i++){
        var list = document.createElement("LI");
      var lab= document.createElement("LABEL");
      var textnode = document.createTextNode(fields[i]+":- ");
       lab.appendChild(textnode);
      var node=document.createElement("INPUT");
      node.type="number";
      list.appendChild(lab);
      document.getElementById("detailDisease").appendChild(list);
      list.appendChild(node);
      document.getElementById("detailDisease").appendChild(list);
      }
    }
    else if(selected_option =="Throat Tumor"){
      var list = document.createElement("LI");
    var lab= document.createElement("LABEL");
    var textnode = document.createTextNode("Upload the image:- ");
     lab.appendChild(textnode);
    var node=document.createElement("INPUT");
    node.type="file";
    list.appendChild(lab);
    document.getElementById("detailDisease").appendChild(list);
    list.appendChild(node);
    document.getElementById("detailDisease").appendChild(list);
    }
  });

  // Append <li> to <ul> with id="myList"
