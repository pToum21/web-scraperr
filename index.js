const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const { error } = require('console')
const express = require('express')
// bring in fs package
const fs = require('fs')

const app = express()

const url = 'https://www.sweetwater.com/shop/software-plugins/virtual-processors/'

const instance = axios.create({
  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36'
      // Add any other headers you want to include here
      // Example:
      // 'Custom-Header': 'Custom-Value'
    }
  }
});

instance.get(url)
  .then(response => {
    // console.log(response.data)

    // write response.data to an example.html file
    fs.writeFile('ex.html', response.data, function (err) {
      if (err) {
        return error
      }

      console.log('File saved....');
    })
    const html = response.data
    const $ = cheerio.load(html)

    const suggested = $('.suggested-products h2');

    suggested.each(function () {
      console.log($(this).next().attr('itemjson'));

      const data = JSON.parse($(this).next().attr('itemjson'));

      fs.writeFile(`data-${Date.now()}.json`, JSON.stringify(data, null, 2), function (err) {
        if (err) return err;

        console.log('Data saved....');
      });
    })
    // console.log(suggested);

    const description = []
    $('.product-suggest__item', html).each(function () {
      const title = $(this).text()
      const header = $(this).find('a').attr('.product-suggest__item-content')
      description.push({
        title,
        header
      })
    })
    // console.log(description)
  }).catch(err => console.log(err))

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
