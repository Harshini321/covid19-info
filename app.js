const express=require("express");
const bodyParser=require("body-parser");
const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
//check
const  https = require('follow-redirects').https;
const  fs = require('fs');

var totalCases;
var totalDeaths;
var countryTotal;
var countryDeaths;
var xAxis=[];
var yAxis=[];
var userCountry;

app.get("/",function(request,response){
    //api call to summary of total in world and in india
    // var https = require('follow-redirects').https;
    // var fs = require('fs');

    var options = {
    'method': 'GET',
    'hostname': 'api.covid19api.com',
    'path': '/summary',
    'headers': {
    },
    'maxRedirects': 20
    };

    var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        // console.log(body.toString());
        var covidData=JSON.parse(body);
        // var index;
        // for (let i=0;i<covidData.Countries.length;i++){
        //     if(covidData.Countries[i].Country===countryName){
        //         index=i;
        //         break;
        //     }
        // }
        for (let i=0;i<covidData.Countries.length;i++){
            xAxis.push(covidData.Countries[i].Country);
            yAxis.push(covidData.Countries[i].TotalConfirmed)
        }

        totalCases=covidData.Global.TotalConfirmed;//total globally
        totalDeaths=covidData.Global.TotalDeaths
        countryTotal=covidData.Countries[77].TotalConfirmed;//total India
        countryDeaths=covidData.Countries[77].TotalDeaths
        console.log(totalCases);//total globally
        console.log(totalDeaths);//total deaths globally
        console.log(countryTotal);//total india
        console.log(countryDeaths);//total deaths in india
        response.render('index',{totalCases:totalCases,totalDeaths:totalDeaths,countryTotal:countryTotal,countryDeaths:countryDeaths,labelsList:xAxis,dataList:yAxis});//check
    });

    res.on("error", function (error) {
        console.error(error);
    });
    });
    
    req.end();
    
})


app.get("/country",function(request,response){

    var https = require('follow-redirects').https;
    var fs = require('fs');

    var options = {
    'method': 'GET',
    'hostname': 'api.covid19api.com',
    'path': '/total/dayone/country/south-africa/status/confirmed',
    'headers': {
    },
    'maxRedirects': 20
    };

    var req = https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        // console.log(body.toString());
        var countryData=JSON.parse(body);

    });

    res.on("error", function (error) {
        console.error(error);
    });
    });

    req.end();
    // response.sendFile(__dirname+"/country.html");
    response.render('country',{countryName:userCountry});
})

app.post("/country",function(request,response){
    userCountry=request.body.countryName;
    console.log(userCountry);
    response.redirect("/country");
})

app.listen(3000,function(){
    console.log("server running at port 3000");
});