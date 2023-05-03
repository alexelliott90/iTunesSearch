import { createSlice } from "@reduxjs/toolkit";

//slice to store variables input by the user
export const itunesSearchSlice = createSlice({

    name: "itunesSearch",

    initialState:   {
                    searchTermInput: "",
                    searchTermItunes: "",
                    mediaOptions: {"All":"all",
                        "Movie":"movie", 
                        "Podcast":"podcast",
                        "Music":"music", 
                        "Music Video":"musicVideo", 
                        "Audiobook":"audiobook", 
                        "Short film":"shortFilm", 
                        "TV Show":"tvShow", 
                        "Software":"software", 
                        "eBook":"ebook"},
                    chosenMedia: "All",
                    chosenMediaSearchTerm: "all",
                    },

    reducers: {
        selectMedia: (state, action) => {
            //store the selection. Default value is 'all' to avoid error if user doesnt select an option.
            state.chosenMedia = action.payload
            //get the actual search time for itunes api corresponding to user selection
            state.chosenMediaSearchTerm = state.mediaOptions[state.chosenMedia]
        },

        storeSearchTerm: (state, action) => {
            state.searchTermInput = action.payload
            //generate string to use in search (replace spaces with "+")
            state.searchTermItunes = state.searchTermInput.replace(/ /g,"+")
        },

    },
});

export const { selectMedia, storeSearchTerm,
} =
    itunesSearchSlice.actions;

export default itunesSearchSlice.reducer;
