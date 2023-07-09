import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoritesState } from "./favoritesSlice";
import { RootState } from "../../../store";
import { writeToLog } from "../../helpers/LogHelper";

export const loadFavorites = createAsyncThunk(
  "Favorites/loadFavorites",
  async () => {
    let favoritesStr;

    console.log("Loading favorites");
    try {
      favoritesStr = await AsyncStorage.getItem("@Favorites");
      console.log("FavoritesStr: ");
      console.log(favoritesStr);
    } catch (e) {
      writeToLog("Error getting Favorites.");
      writeToLog(e.toString());
      return null;
    }

    if (!favoritesStr) {
      return null;
    }

    return JSON.parse(favoritesStr) as FavoritesState;
  }
);

export const toggleFavorite = createAsyncThunk(
  "Favorites/toggleFavorite",
    async (favorite: [string, string, boolean], thunkAPI) => {
    // console.log("Saving fav: " + JSON.stringify(favorite));
    // console.log("Key: " + favorite[0])
    // console.log("Val: " + favorite[1])
    
    let favorites;
    try {
        const state = thunkAPI.getState() as RootState;
        const username = favorite[0];
        const community = favorite[1];
        const toAdd = favorite[2];

        // console.log(`username: ${username}`)
        
        favorites = {
            ...state.favorites,
            // favorites: {}
            favorites: {
                ...state.favorites.favorites,
            }
        };
        // delete favorites.swipeGestures;
        favorites.favorites[username] = (username in favorites.favorites) ? { ...state.favorites.favorites[username] } : {}
        // favorites.favorites[username][community] = toAdd;
        if(toAdd){
            favorites.favorites[username][community] = toAdd;
        } else {
            delete favorites.favorites[username][community];
        }

        console.log("Favorites: ")
        console.log(JSON.stringify(favorites));
    } catch(e) {
        console.log(`Error: ${e}`);
    }

    AsyncStorage.setItem("@Favorites", JSON.stringify(favorites));

    return favorite;
  }
);
