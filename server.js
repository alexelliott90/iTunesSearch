const express = require('express')
const fs = require('fs')
const app = express()
const port = process.env.PORT || 8080

//set up cors
const cors = require("cors")
app.use(cors())

//set up helmet
const helmet = require("helmet");
app.use(helmet());

//import axios to use instead of fetch method
const axios = require("axios");

//get function to fetch user request (using parameters stored in JSON) from the itunes api and display
app.get("/api/itunesSearchResults", async (req, res) => {
    const { term, media } = req.query;
    try {
        const response = await axios.get(
            `https://itunes.apple.com/search?term=${term}&media=${media}`
        );
        //create object for the results containing the desired variables from the API
        const results = response.data.results.map((result) => ({
            id: result.trackId,
            name: result.trackName,
            artist: result.artistName,
            artwork: result.artworkUrl100.replace("100x100", "200x200"),
            previewUrl: result.previewUrl,
            kind: result.kind,
            price: result.trackPrice,
            currency: result.currency,
            favorite: false,
            genre: result.primaryGenreName,
        }));
        //respond with the results
        res.json(results);
    } catch (error) {
        //handle errors
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port http://localhost:${port}!`)
})

//sources:
//I had assistance from Kyle Marunda in solving coding issues after reviewer feedback