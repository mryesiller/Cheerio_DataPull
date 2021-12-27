//Libraries
const axios = require('axios');
const cheerio = require('cheerio');
const fs=require('fs');


//Read the existing json file
const priceData=JSON.parse(fs.readFileSync(`${__dirname}/price.json`))


//WriteFile function promise setup
const writeFilePro=(file,data)=>{
    return new Promise((resolve,reject)=>{
        fs.writeFile(file,data,err=>{
            if(err) reject('Could not find file')
            resolve("success")
        })
    })
}

//Async function to get price data from exact URL
const getPrice = async () => {
	try {
		const { data } = await axios.get(
			'https://bigpara.hurriyet.com.tr/doviz/dolar/'
		);

		const $ = cheerio.load(data);
		const usdTry=$("div[class='kurBox last'] > span[class='text2']").text()

		return usdTry;

	} catch (error) {
		throw error;
	}
};

//PriceData get every 10sec and adding to jsonfile
setInterval(() => {
    getPrice()
    .then((usdTry) =>{        

        priceData.push({
            date:new Date().toString(),
            pair:"Usd/Try",
            price:usdTry
        })
                
        return priceData
    })
    .then(data=>{       
        writeFilePro(`${__dirname}/price.json`,JSON.stringify(data))
        console.log(data)
    });

}, 10000);