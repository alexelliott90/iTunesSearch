const express = require('express')
const fs = require('fs')

const searchTerms = fs.readFileSync('userSearchParameters.json')
search = JSON.parse(searchTerms)
console.log(search[0].media)