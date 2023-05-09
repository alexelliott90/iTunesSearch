import {React, useState} from "react";
import axios, * as others from 'axios';

function SearchItunes(){
    const [searchTerm, setSearchTerm] = useState("")
    const [media, setMedia] = useState("all");
    const [results, setResults] = useState([]);
    const [savedItemList, setSavedItemList] = useState([])

    //declare the count of saved items and search results which will be displayed on the page
    const savedItemCount = savedItemList.length
    const resultCount = results.length
 
    //declare the options which will go in the dropdown for selecting media type
    const mediaOptions = [ "all",
                            "movie", 
                            "podcast",
                            "music", 
                            "musicVideo", 
                            "audiobook", 
                            "shortFilm", 
                            "tvShow", 
                            "software", 
                            "ebook" ]

    //search the itunes API on click
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await axios.get(`/api/itunesSearchResults?term=${searchTerm}&media=${media}`);
            setResults(response.data);
            console.log(results)
        } catch (error) {
            console.error(error);
        }
    };


    //generate options and keys for media options display
    const mediaList = Object.keys(mediaOptions)
    const mediaKeys = Object.keys(mediaList)

    //create a dropdown of the project names to use as a selector
    const mediaDropdown = mediaKeys.map(option => (
        <option key={option}>
            {mediaOptions[option]}
        </option>
    ))

    //create a new project on click
    const handleSaveItem = (e) => {
        let saveItem = {}

        //define the variables for the saved item
        saveItem.id = results[e.target.value].id
        saveItem.kind = results[e.target.value].kind
        saveItem.artist = results[e.target.value].artist
        saveItem.name = results[e.target.value].name
        saveItem.genre = results[e.target.value].genre

        //add the saved item to the list of saved items and render on the page
        setSavedItemList([saveItem, ...savedItemList])
    }
    
    //generate keys for projects display
    const searchResultKeys = Object.keys(results)
    
    //display the current list of search results in a table
    const searchResultDisplay = searchResultKeys.map(item => (
        <tr key={item.id}>
            <th className="TableText">{results[item].kind}</th>
            <td className="TableText">{results[item].artist}</td>  
            <td className="TableText">{results[item].name}</td>
            <td className="TableText">{results[item].genre}</td>
            <td className="TableText"><button className="TableButton" value={item} variant="primary" size="lg" type="submit" onClick={handleSaveItem}>Save</button></td>
        </tr>
    ))

    //delete a project on click
    const handleDeleteItem = (id) => {
        setSavedItemList(savedItemList.filter((item) => item.id !== id))
    }

    //generate keys for projects display
    const savedItemKeys = Object.keys(savedItemList)
    
    //display the current list of saved items in a table
    const savedItemDisplay = savedItemKeys.map(item => (
        <tr key={item.id}>
            <th className="TableText">{savedItemList[item].kind}</th>
            <td className="TableText">{savedItemList[item].artist}</td>  
            <td className="TableText">{savedItemList[item].name}</td>
            <td className="TableText">{savedItemList[item].genre}</td>
            <td className="TableText"><button className="TableButton" value={item} variant="primary" size="lg" type="submit" onClick={() => handleDeleteItem(savedItemList[item].id)}>Delete</button></td>
        </tr>
    ))

    return(
        <div>
            <div className='row row-flex mt-3'>
                <h1 className="TitleText">Search itunes</h1>
                <h2 className="TitleText2">Enter your search below:</h2>
                <div className="container">
                    <form className="FormItems">
                        <input className="InputBox" placeholder="Search Term" onChange={(e) => setSearchTerm(e.target.value)}/>
                        <select className="Dropdown" onChange={(e) => setMedia(e.target.value)}>
                                <option value="">Select media type</option>
                                {mediaDropdown}
                        </select>
                        <button className="SubmitButton" variant="primary" size="lg" type="submit" onClick={handleSubmit}>Search</button>
                    </form>
                </div>
            </div>
            <div className='row mt-3'>
                <div className="col-md-6">
                    <h1 className="TitleText">Search Results</h1>
                    <h2 className="TitleText2">You have {resultCount} results, shown below:</h2>
                    <div className="table-responsive">
                        <table className="table">
                            <thead className="TableHead">
                                <tr>
                                    <th className="TableTitle" scope="col">Type</th>
                                    <th className="TableTitle" scope="col">Artist</th>
                                    <th className="TableTitle" scope="col">Title</th>
                                    <th className="TableTitle" scope="col">Genre</th>
                                    <th className="TableTitle" scope="col">Save Item</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResultDisplay}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-md-6">
                    <h1 className="TitleText">Saved Items</h1>
                    <h2 className="TitleText2">You have {savedItemCount} saved items, shown below:</h2>
                    <div className="table-responsive">
                        <table className="table SearchList">
                            <thead className="TableHead">
                                <tr>
                                    <th className="TableTitle" scope="col">Type</th>
                                    <th className="TableTitle" scope="col">Artist</th>
                                    <th className="TableTitle" scope="col">Title</th>
                                    <th className="TableTitle" scope="col">Genre</th>
                                    <th className="TableTitle" scope="col">Delete Item</th>
                                </tr>
                            </thead>
                            <tbody>
                                {savedItemDisplay}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchItunes

//sources:
//I had assistance from Kyle Marunda in solving coding issues after reviewer feedback