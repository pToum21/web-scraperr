const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()

const url = 'https://www.sweetwater.com/'

axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const description = []
        $('.product-suggest__item', html).each(function() {
            const title = $(this).text()
            const header = $(this).find('a').attr('.product-suggest__item-content')
            description.push({
                title,
                header
            })
        })
        console.log(description)
    }).catch(err => console.log(err))

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
