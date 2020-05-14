const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');
const http = require('http');
const app = express();
app.use(bodyParser.urlencoded({extended : true}));


app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.use(express.static("public"));

app.post("/", function(req,res){
  console.log("in post");
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    "firstName": firstName,
		"lastName":lastName,
		"emailid":email
  }

  console.log(firstName + lastName + email);

  const jsonData = JSON.stringify(data);
  const url = "http://localhost:3002/subscriber";
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(jsonData)
    }
  };

  var jsonResponse;
  const request = http.request(url, options, function(response){
    console.log( "STATUS: " + response.statusCode);
    console.log("HEADERS: " +  JSON.stringify(response.headers));

    response.on("data", function(data){
      jsonResponse = JSON.parse(data);
      if(response.statusCode === 200){
        if(jsonResponse.isUserAlreadyExists === "Yes"){
          res.sendFile(__dirname + "/signin.html");
        }else{
          res.sendFile(__dirname + "/success.html");
        }
      }
      else{
        res.sendFile(__dirname + "/failure.html");
      }
    })
  })
  request.on('error', (e) => {
    res.sendFile(__dirname + "/failure.html");
  });
  request.write(jsonData);
  request.end();
  
})

app.post("/failure", function(req,res){
  res.redirect("/");
})

app.listen(3000, function(){
    console.log("server started at port 3000");
})