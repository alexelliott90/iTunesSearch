import { configureStore } from "@reduxjs/toolkit";
import itunesSearchReducer from "./itunesSearch";

export default configureStore({
    reducer: {
        itunesSearch: itunesSearchReducer,
},
});
