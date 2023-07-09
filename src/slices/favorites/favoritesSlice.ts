import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { loadFavorites, toggleFavorite } from "./favoritesActions";

export interface FavoritesState {
  loaded: boolean;
  favorites: {};
}

const initialState: FavoritesState = {
  loaded: false,
  favorites: {},
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      loadFavorites.fulfilled,
      (state: FavoritesState, action) => {
        if (action.payload) {
          for (const key in action.payload) {
            if (key === "favorites") {
              state[key] = { ...action.payload[key] };
            } else {
              state[key] = action.payload[key];
            }
          }
        }

        state.loaded = true;
      }
    );

    builder.addCase(loadFavorites.rejected, (state) => {
      state.loaded = true;
    });

    builder.addCase(toggleFavorite.fulfilled, (state, action) => {
      const username = action.payload[0];
      const community = action.payload[1];
      const toAdd = action.payload[2];

      state.favorites[username] =
        username in state.favorites ? { ...state.favorites[username] } : {};
      if (toAdd) {
        state.favorites[username][community] = toAdd;
      } else {
        delete state.favorites[username][community];
      }
    });
  },
});

export const selectFavorites = (state: RootState) => state.favorites;
export const selectFavoritesLoaded = (state: RootState) =>
  state.favorites.loaded;

export default favoritesSlice.reducer;
