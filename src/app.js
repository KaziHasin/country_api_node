const path = require("path");
const express = require("express");
const app = express();
const hbs = require("hbs");
const fetch = require("node-fetch");
// const { response } = require("express");
const fs = require("fs");
const { response } = require("express");
const port = process.env.PORT || 3002

let getPath = path.join(__dirname, "../public");
let partialPath = path.join(__dirname, "../views/handlebars");

app.set('view engine', 'hbs');
hbs.registerPartials(partialPath);
app.use(express.static(getPath));
app.use(express.json());


fetch('https://restcountries.com/v2/all')
    .then((response) => response.json())
    .then((data) => {
        let resText = JSON.stringify(data);
        let resObj = JSON.parse(resText);
        let resArr = [resObj];

        resArr.map((mapData, index) => {

            // console.log(mapData);

            loadData(mapData);

        });





    })

const loadData = (sendData) => {

    let data = [];

    //  response for index page show slider county list
    app.post('/totalCountry', (req, res) => {
        let randomCountry = req.body.randomCountry;


        let boundCountry = randomCountry + 3;

        for (let i = randomCountry; i < boundCountry; i++) {


            data.push(sendData[i].name);
            data.push(sendData[i].flags.svg);


        }


        res.send({ data: data });
    })



}

// request and response for country searching in contry page 
app.post('/oneCountry', (req, res) => {

    let searchTerm = req.body.serachTerms;

    fetch(`https://restcountries.com/v2/name/${searchTerm}?fullText=true`)
        .then((response) => response.json())
        .then((data) => {
            let resText = JSON.stringify(data);
            let resObj = JSON.parse(resText);
            let resArr = [resObj];
            let countryInfo = [];

            resArr.map((data2) => {

                countryInfo.push(data2[0].name)
                countryInfo.push(data2[0].flag)
                countryInfo.push(data2[0].capital)
                countryInfo.push(data2[0].population)

                res.send({ countryInfo })

            })




        })

})







app.get("", (req, res) => {
    res.render("index");

})

app.get("/about", (req, res) => {
    res.render("about");

})

app.get("/county", (req, res) => {
    res.render("county");

})

app.get("*", (req, res) => {
    res.render("error_404", {
        msgError: "The page you have typed is wrong.."
    });

})

app.listen(port, () => {
    console.log("website listen on " + port + " port");
});