import {React, useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux"
import {selectMedia, storeSearchTerm} from "../store/itunesSearch.js";

function SearchItunes(){
    const mediaOptions = useSelector((state) => state.itunesSearch.mediaOptions)
    const searchTerm = useSelector((state) => state.itunesSearch.searchTermItunes)
    const mediaSearchTerm = useSelector((state) => state.itunesSearch.chosenMediaSearchTerm)

    let [searchResultList, setSearchResultList] = useState([])
    let [resultCount, setResultCount] = useState(0)
    
    const [savedItemList, setSavedItemList] = useState([])
    const savedItemCount = savedItemList.length

    const dispatch = useDispatch();

    const mediaSelector = (e) => {
        dispatch(selectMedia(e.target.value))
    }

    const startSearch = (e) => {
        sendSearch("/searchTerms", {"media":mediaSearchTerm, "term":searchTerm})
        .then((data) => console.log(data))
        .catch(error => console.error(error));
    }

    //function to send search terms to back end to carry out the itunes search
    async function sendSearch(url, data){
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
            })
            .then(response => response.json())
    }

    //generate options and keys for media options display
    const mediaList = Object.keys(mediaOptions)
    const mediaKeys = Object.keys(mediaList)

    //create a dropdown of the project names to use as a selector
    const mediaDropdown = mediaKeys.map(option => (
        <option key={option}>
            {mediaList[option]}
        </option>
    ))

    //fetch the search results from the itunes search api
    async function fetchData() {
        let response = await fetch("/itunesSearchResults");
        let data = await response.json();
        let searchResults = data.results
        let resultCount = data.resultCount
        
        setSearchResultList(searchResults);
        setResultCount(resultCount)
    }
    //call fetchdata function
    fetchData();

    //function to post a new saved item
    async function newSavedItem(url, data){
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(fetchSavedItems())
    }

    //create a new project on click
    const saveItem = (e) => {
        let saveItem = {}
        saveItem.kind = searchResultList[e.target.value].kind
        saveItem.artistName = searchResultList[e.target.value].artistName
        saveItem.trackName = searchResultList[e.target.value].trackName
        saveItem.primaryGenreName = searchResultList[e.target.value].primaryGenreName

        newSavedItem("/saved", saveItem)
        .then((data) => console.log(data))
        .catch(error => console.error(error));

    }
    
    //generate keys for projects display
    const searchResultKeys = Object.keys(searchResultList)
    
    //display the current list of search results in a table
    const searchResultDisplay = searchResultKeys.map(item => (
        <tr key={item}>
            <th className="TableText">{searchResultList[item].kind}</th>
            <td className="TableText">{searchResultList[item].artistName}</td>  
            <td className="TableText">{searchResultList[item].trackName}</td>
            <td className="TableText">{searchResultList[item].primaryGenreName}</td>
            <td className="TableText"><button className="TableButton" value={item} variant="primary" size="lg" type="submit" onClick={saveItem}>Save</button></td>
        </tr>
    ))

    //fetch the list of saved items from the saved items api using async function
    async function fetchSavedItems() {
        let response = await fetch("/savedItems");
        let data = await response.json();
        setSavedItemList(data);
    }
    //call fetchSavedItems function
    fetchSavedItems();

    //function to delete a project from the API
    async function deleteSavedItem(url, data) {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(fetchSavedItems())
    }

    //delete a project on click
    const deleteItem = (e) => {

        let index = e.target.value

        deleteSavedItem("/saved", {"index": index})
        .then((data) => console.log(data))
        .catch(error => console.error(error));
    }

    //generate keys for projects display
    const savedItemKeys = Object.keys(savedItemList)
    
    //display the current list of saved items in a table
    const savedItemDisplay = savedItemKeys.map(item => (
        <tr key={item}>
            <th className="TableText">{savedItemList[item].kind}</th>
            <td className="TableText">{savedItemList[item].artistName}</td>  
            <td className="TableText">{savedItemList[item].trackName}</td>
            <td className="TableText">{savedItemList[item].primaryGenreName}</td>
            <td className="TableText"><button className="TableButton" value={item} variant="primary" size="lg" type="submit" onClick={deleteItem}>Delete</button></td>
        </tr>
    ))

    return(
        <div>
            <div className='row row-flex mt-3'>
                <h1 className="TitleText">Search itunes</h1>
                <h2 className="TitleText2">Enter your search below:</h2>
                <div className="container">
                    <form className="FormItems">
                        <input className="InputBox" placeholder="Search Term" onChange={(e) => (dispatch(storeSearchTerm(e.target.value)))}/>
                        <select className="Dropdown" onChange={mediaSelector}>
                                <option value="">Select media type</option>
                                {mediaDropdown}
                        </select>
                        <button className="SubmitButton" variant="primary" size="lg" type="submit" onClick={startSearch}>Search</button>
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
                                    <th className="TableTitle" scope="col">Id</th>
                                    <th className="TableTitle" scope="col">Title</th>
                                    <th className="TableTitle" scope="col">Description</th>
                                    <th className="TableTitle" scope="col">URL</th>
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