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
let full_userCountry;
let idx;
let userCountry;
let userDays;
let startDate;
let xAxis=[];
let yAxis=[];
let countriesList=[["Andaman and Nicobar","AN"],["Andhra Pradesh","AP"],["Arunachal Pradesh","AR"],["Assam","AS"],["Bihar","BR"],["Chandigarh","CH"],["Chhattisgarh","CT"],["Delhi","DL"],["Daman and Diu","DN"],["Goa","GA"],["Gujarat","GJ"],["Himachal Pradesh","HP"],["Haryana","HR"],["Jharkhand","JH"],["Jammu and Kashmir","JK"],["Karnataka","KA"],["Kerala","KL"],["Lakshadweep","LA"],["Ladakh","LD"],["Maharashtra","MH"],["Meghalaya","ML"],["Manipur","MN"],["Madhya Pradesh","MP"],["Mizoram","MZ"],["Nagaland","NL"],["Odisha","OR"],["Punjab","PB"],["Puducherry","PY"],["Rajasthan","RJ"],["Sikkim","SK"],["Telangana","TG"],["Tamil Nadu","TN"],["Tripura","TR"],["TT","TT"],["UN","UN"],["Uttar Pradesh","UP"],["Uttarakhand","UT"],["West Bengal","WB"]];
let countriesList1=["AN","AP","AR","AS","BR","CH","CT","DL","DN","GA","GJ","HP","HR","JH","JK","KA","KL","LA","LD","MH","ML","MN","MP","MZ","NL","OR","PB","PY","RJ","SK","TG","TN","TR","TT","UN","UP","UT","WB"];

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
    // countriesList=[];
    res.on("end", function (chunk) {
        response.render('index',{totalCases:766895075,totalDeaths:6935889,countryTotal:44987891,countryDeaths:531849});
    });

    res.on("error", function (error) {
        console.error(error);
    });
    });

    req.end();
    
})

function formatDate(date) {
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // Add leading zero if necessary
    var day = ("0" + date.getDate()).slice(-2); // Add leading zero if necessary
    return year + "-" + month + "-" + day;
}

app.get("/state",function(request,response){
    // country wise data
    var https = require('follow-redirects').https;
    var fs = require('fs');

    var options = {
        'method': 'GET',
        'hostname': 'data.covid19india.org',
        'path': '/v4/min/timeseries.min.json',
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
 
        var startDate1 = new Date(startDate);
        var x = userDays;
        for (var i = 0; i < x; i++) {
            var currentDate = new Date(startDate1);
            currentDate.setDate(startDate1.getDate() + i);
            var formattedDate = formatDate(currentDate);
            xAxis.push(formattedDate);
        }
        for(var i=0;i<x;i++){
            var cases_new=countryData.WB.dates[xAxis[i]].total.confirmed;
            yAxis.push(cases_new);
        }

        var idx = countriesList1.indexOf(userCountry);
        var full_userCountry=countriesList[idx];
        response.render('country',{countryName:full_userCountry,userDays:userDays,yAxis:yAxis,xAxis:xAxis,countriesList:countriesList});
    });

    res.on("error", function (error) {
        console.error(error);
    });
    });

    req.end();
})

app.post("/state",function(request,response){
    userCountry=request.body.countryName;
    userDays=request.body.noOfDays;
    startDate=request.body.startDate;
    // console.log(startDate);
    response.redirect("/state");
})

app.listen(process.env.PORT ||3000,function(){
    console.log("server running at port 3000");
});
// done