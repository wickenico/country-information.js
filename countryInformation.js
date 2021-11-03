/* --------------------------------------------------------------
Script: country information
Author: Nico Wickersheim
Version: 1.0.0

Description:
Displays different informations about a country, chosen by the ip location or a static input.

Changelog:

0.9.0: Initialization
1.0.0: Added error handling
-------------------------------------------------------------- */
let country = ""; // Write a country between the "", e.g let country = "germany"; to set a static country,

// if country is empty the location is detected by the ip adress
if (country == "") {
    const countryUrl = "http://ip-api.com/json";
    const reqCountry = new Request(countryUrl);
    const resCountry = await reqCountry.loadJSON();
    country = resCountry.country;
}

const countryListUrl = 'https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes'

const url = 'https://restcountries.com/v3.1/name/' + country + '?fields=name,capital,currencies,flag,population,timezones,continents';
const req = new Request(url);
const res = await req.loadJSON();
//console.log(res)

// Check if country input is wrong
let reqFailed = JSON.stringify(res).includes("404")

let capital = "";
let continent = "";
let currency = "";
let symbol = "";
let flag = "";
let name = "";
let population = "";
let timezone = "";

// Country was found so parse all informations
if (reqFailed == false) {
    capital = res[0].capital[0];
    //console.log(capital)

    continent = res[0].continents[0];
    //console.log(continent)

    const currencyBase = Object.keys(res[0].currencies)[0];
    currency = res[0].currencies[currencyBase].name;
    //console.log(currency);

    symbol = res[0].currencies[currencyBase].symbol;
    //console.log(symbol);

    flag = res[0].flag;
    //console.log(flag)

    const nameBase = Object.keys(res[0].name.nativeName)[0];
    //console.log(nameBase)

    name = res[0].name.nativeName[nameBase].common;
    //console.log(name)

    population = res[0].population;
    //console.log(population)

    timezone = res[0].timezones[0];
    //console.log(timezone)
}

let widget = createWidget(capital, continent, currency, symbol, flag, name, population, timezone);
if (config.runsInWidget) {
    // create and show widget
    Script.setWidget(widget);
    Script.complete();
}
else {
    widget.presentSmall();
}

function createWidget(capital, continent, currency, signal, flag, name, population, timezone) {

    let w = new ListWidget();
    w.setPadding(8, 10, 0, 10);

    if (reqFailed === true) {
        w.url = countryListUrl;
    }

    let lightColor = Color.black();
    let darkColor = Color.white();

    const upperStack = w.addStack();
    upperStack.layoutHorizontally();

    const upperTextStack = upperStack.addStack();
    upperTextStack.layoutVertically();

    if (reqFailed == false) {

        let countryNameText = upperTextStack.addText(name);
        countryNameText.font = Font.boldSystemFont(14);
        countryNameText.textColor = Color.yellow();

        upperStack.addSpacer(4);

        let flagImg = upperStack.addText(flag);
        flagImg.font = Font.boldSystemFont(18);
        flagImg.textColor = Color.white();

        w.addSpacer(6);

        let infoStack = w.addStack();
        infoStack.layoutVertically();

        let capitalText = infoStack.addText('Capital: ' + capital);
        capitalText.font = Font.regularSystemFont(11);
        capitalText.textColor = Color.dynamic(lightColor, darkColor);

        infoStack.addSpacer(5);

        let continentText = infoStack.addText('Cont.: ' + continent);
        continentText.font = Font.regularSystemFont(11);
        continentText.textColor = Color.dynamic(lightColor, darkColor);

        infoStack.addSpacer(5);

        let currencyText = infoStack.addText('CY: ' + currency + ' ' + symbol);
        currencyText.font = Font.regularSystemFont(11);
        currencyText.textColor = Color.dynamic(lightColor, darkColor);

        infoStack.addSpacer(5);

        let populationText = infoStack.addText('Pop.: ' + population.toLocaleString());
        populationText.font = Font.regularSystemFont(11);
        populationText.textColor = Color.dynamic(lightColor, darkColor);

        infoStack.addSpacer(5);

        let timezoneText = infoStack.addText('Timezone: ' + timezone);
        timezoneText.font = Font.regularSystemFont(11);
        timezoneText.textColor = Color.dynamic(lightColor, darkColor);

        upperStack.addSpacer(5);

    } else {

        // Write error message

        errorHeadline = w.addText('Country not found.');
        errorHeadline.textColor = Color.yellow()
        errorHeadline.centerAlignText()
        errorHeadline.font = Font.systemFont(13)

        w.addSpacer(8)

        clickText = w.addText('Click for list of country codes');
        clickText.textColor = Color.red()
        clickText.centerAlignText()
        clickText.font = Font.boldSystemFont(12)

        w.addSpacer(6)

        let handSFSymbol = SFSymbol.named("hand.point.up.fill");
        handSFSymbol = w.addImage(handSFSymbol.image);
        handSFSymbol.tintColor = Color.red();
        handSFSymbol.imageSize = new Size(18, 18)
        handSFSymbol.centerAlignImage()

        w.addSpacer(14)

        // Bottom date text 
        let currentDate = new Date();
        let lastDate = w.addDate(currentDate);
        lastDate.textColor = Color.gray()
        lastDate.font = Font.mediumSystemFont(10)
        lastDate.centerAlignText();

    }

    return w;

}