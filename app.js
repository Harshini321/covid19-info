const express=require("express");
const bodyParser=require("body-parser");

const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
//check
const  https = require('follow-redirects').https;
const  fs = require('fs');

let totalCases;
let totalDeaths;
let countryTotal;
let countryDeaths;

let userCountry;
let userDays;
let xAxis=[];
let yAxis=[];
let countriesList=[];



app.get("/",function(request,response){

    // overall cases data
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
    countriesList=[];
    res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        var covidData=JSON.parse(body);

        // Countrieslist
        for (let i=0;i<covidData.Countries.length;i++){
            countriesList.push(covidData.Countries[i].Country);
        };

        totalCases=covidData.Global.TotalConfirmed;//total globally
        totalDeaths=covidData.Global.TotalDeaths
        countryTotal=covidData.Countries[77].TotalConfirmed;//total India
        countryDeaths=covidData.Countries[77].TotalDeaths
        response.render('index',{totalCases:totalCases,totalDeaths:totalDeaths,countryTotal:countryTotal,countryDeaths:countryDeaths});
    });

    res.on("error", function (error) {
        console.error(error);
    });
    });

    req.end();
    
})


app.get("/country",function(request,response){
    // country wise data
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

        let newCases;
        let temp=countryData.length-userDays-1;

        // creating data list
        for(let i=((countryData.length)-1);i>temp;i--){
            newCases=countryData[i].Cases-countryData[i-1].Cases;
            yAxis.push(newCases);
        }
        yAxis.reverse();

        const today=new Date();
        const text=today.toLocaleDateString();

        let priorDate;
        let priorDateText;
        // creating dates list
        for (let j=0;j<userDays;j++){
            priorDate=new Date(new Date().setDate(today.getDate()-j));
            priorDateText=priorDate.toLocaleDateString();
            xAxis.push(priorDateText);
        }   
        xAxis.reverse();
        response.render('country',{countryName:userCountry,userDays:userDays,yAxis:yAxis,xAxis:xAxis,countriesList:countriesList});
    });

    res.on("error", function (error) {
        console.error(error);
    });
    });

    req.end();
})

app.post("/country",function(request,response){
    userCountry=request.body.countryName;
    userDays=request.body.noOfDays;
    response.redirect("/country");
})

app.listen(process.env.PORT ||3000,function(){
    console.log("server running at port 3000");
});
// done