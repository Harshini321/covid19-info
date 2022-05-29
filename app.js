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


var userCountry;
var xAxis=[];
var yAxis=[];




app.get("/",function(request,response){

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
        var covidData=JSON.parse(body);

        totalCases=covidData.Global.TotalConfirmed;//total globally
        totalDeaths=covidData.Global.TotalDeaths
        countryTotal=covidData.Countries[77].TotalConfirmed;//total India
        countryDeaths=covidData.Countries[77].TotalDeaths
        console.log(totalCases);//total globally
        console.log(totalDeaths);//total deaths globally
        console.log(countryTotal);//total india
        console.log(countryDeaths);//total deaths in india
        response.render('index',{totalCases:totalCases,totalDeaths:totalDeaths,countryTotal:countryTotal,countryDeaths:countryDeaths});//check
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
    'path': '/total/dayone/country/'+userCountry+'/status/confirmed',
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
        xAxis=[];
        yAxis=[];
        var body = Buffer.concat(chunks);

        var countryData=JSON.parse(body);

        var newCases;
        for(let i=countryData.length-1;i>countryData.length-21;i--){
            newCases=countryData[i].Cases-countryData[i-1].Cases
            yAxis.push(newCases);
        }
        yAxis.reverse();
        console.log(yAxis);

        const today=new Date();
        const text=today.toLocaleDateString();

        var priorDate;
        var priorDateText;
        
        for (let j=0;j<20;j++){
            priorDate=new Date(new Date().setDate(today.getDate()-j));
            priorDateText=priorDate.toLocaleDateString();
            xAxis.push(priorDateText);
        }   
        xAxis.reverse();
        response.render('country',{countryName:userCountry,yAxis:yAxis,xAxis:xAxis});
    });

    res.on("error", function (error) {
        console.error(error);
    });
    });

    req.end();
})

app.post("/country",function(request,response){
    userCountry=request.body.countryName;
    response.redirect("/country");
})

app.listen(3000,function(){
    console.log("server running at port 3000");
});