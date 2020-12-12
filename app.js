//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { send } = require("process");

const app = express();
//use for static files such as css and images
app.use(express.static("public"));

//use get information entered by the user
app.use(bodyParser.urlencoded({extended: true}));

//get signup page
app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

//get information from the form
app.post("/", function(req, res){
    
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const eMail = req.body.eMail;

    const data = {
        members: [
            {
                email_address: eMail,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };



    const jsonData = JSON.stringify(data);

    const url = "https://us7.api.mailchimp.com/3.0/lists/d319e9ce18";

    const options = {
        method: "POST",
        auth: "Christian1:ee54bb707e8126cb990908f32d1325ec-us7"
    }

     const request = https.request(url, options, function(response){
         if(response.statusCode === 200){
             res.sendFile(__dirname + "/success.html");
         }else{
             res.sendFile(__dirname + "/failure.html");
         }

       response.on("data", function(data){
        console.log(JSON.parse(data));
       })
    })
    request.write(jsonData);
    request.end();
});

//Failure Route
app.post("/failure", function(req, res){
    res.redirect("/");
})

//Success Route
app.post("/success", function(req, res){
    res.redirect("/");
})

//server running response
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
});

/*API Key
ee54bb707e8126cb990908f32d1325ec-us7

List ID
d319e9ce18*/
