import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FavoritesState } from "./favoritesSlice";
import { RootState } from "../../../store";
import { writeToLog } from "../../helpers/LogHelper";

export const loadFavorites = createAsyncThunk(
  "favorites/loadFavorites",
  async () => {
    let favoritesStr;

    try {
      favoritesStr = await AsyncStorage.getItem("@favorites");
    } catch (e) {
      writeToLog("Error getting @favorites.");
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
  "favorites/toggleFavorite",
  async (favorite: [string, string, boolean], thunkAPI) => {
    let favorites;
    try {
      const state = thunkAPI.getState() as RootState;
      const username = favorite[0];
      const community = favorite[1];
      const toAdd = favorite[2];

      favorites = {
        ...state.favorites,
        favorites: {
          ...state.favorites.favorites,
        },
      };
      favorites.favorites[username] =
        username in favorites.favorites
          ? { ...state.favorites.favorites[username] }
          : {};
      if (toAdd) {
        favorites.favorites[username][community] = toAdd;
      } else {
        delete favorites.favorites[username][community];
      }
    } catch (e) {
      writeToLog(`Error toggling favorites: ${e}`);
    }

    AsyncStorage.setItem("@favorites", JSON.stringify(favorites));

    return favorite;
  }
);
