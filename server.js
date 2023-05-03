const express = require('express')
const fs = require('fs')
const app = express()
const PORT = process.env.PORT || 8080

//set up helmet
const helmet = require("helmet");
app.use(helmet());

//set up cors
const cors = require("cors")
app.use(cors())

//bodyparser to allow json objects to be passed to the server
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('Hello World')
})

// get the list of users saved items
app.get('/savedItems', (req, resp)=>{
    const savedItems = getSavedItems()
    resp.send(savedItems)
})

// utility function - gets projects data, and creates the file if it doesn't exist
function getSavedItems(){
    try {
        const content = fs.readFileSync('userSavedItems.json')
        return JSON.parse(content)
    }catch(e){ // file non-existent
        fs.writeFileSync('userSavedItems.json', '[]')
        return []
    }
}

// get the user search terms
app.get('/search', (req, resp) => {
    const searchParameters = getSearchTerms()
    resp.send(searchParameters)
})

// utility function - gets user search terms, and creates the file if it doesn't exist
function getSearchTerms(){
    try {
        const content = fs.readFileSync('userSearchParameters.json')
        return JSON.parse(content)
    }catch(e){ // file non-existent
        fs.writeFileSync('userSearchParameters.json', '[]')
        return []
    }
}

//update the user search terms and store in JSON
app.put('/searchTerms/', (req, resp) => {
    const newMedia = req.body.media
    const newTerm = req.body.term

    const searchTerms = getSearchTerms()

    //update the search terms
    searchTerms[0].media = newMedia
    searchTerms[0].term = newTerm
    fs.writeFileSync('userSearchParameters.json', JSON.stringify(searchTerms))
})

//get function to fetch user request (using parameters stored in JSON) from the itunes api and display
app.get('/itunesSearchResults', (req, resp) => {
    const searchTerms = JSON.parse(fs.readFileSync('userSearchParameters.json'))
    const media = searchTerms[0].media
    const term = searchTerms[0].term
    
    async function searchItunes(){
        await fetch(`https://itunes.apple.com/search?media=${media}&term=${term}`)
        .then(res => res.json())
        .then((result) => {
            items = result
            resp.send(items)
            })
    }

    searchItunes()
})

// function to add a saved item
function addSavedItem(kind, artistName, trackName, primaryGenreName){
    const savedItems = getSavedItems()
    savedItems.push({"kind":kind,"artistName":artistName, "trackName":trackName, "primaryGenreName":primaryGenreName})
    fs.writeFileSync('userSavedItems.json', JSON.stringify(savedItems))
}

// create new saved item
app.post('/saved/', (req, resp)=>{
    const kind = req.body.kind
    const artistName = req.body.artistName
    const trackName = req.body.trackName
    const primaryGenreName = req.body.primaryGenreName
    const savedItems = getSavedItems()

    //call add saved item function
    addSavedItem(kind, artistName, trackName, primaryGenreName)
    
})

//function to delete a saved item
function deleteProject(index){
    const savedItems = getSavedItems()
    savedItems.splice(index, 1)
    fs.writeFileSync('userSavedItems.json', JSON.stringify(savedItems))
}

// delete saved item
app.delete('/saved/', (req, resp) => {
    console.log(req.body.index)
    const index = req.body.index
    deleteProject(index)
    })


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}!`)
})