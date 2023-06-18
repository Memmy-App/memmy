import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsState } from "./settingsSlice";
import { RootState } from "../../store";

export const loadSettings = createAsyncThunk(
  "settings/loadSettings",
  async () => {
    let settingsStr;

    try {
      settingsStr = await AsyncStorage.getItem("@settings");
    } catch (e) {
      return null;
    }

    if (!settingsStr) {
      return null;
    }

    return JSON.parse(settingsStr) as SettingsState;
  }
);

export const setSetting = createAsyncThunk(
  "settings/setSetting",
  async (setting: object, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const settings = {
      ...state.settings,
      ...setting,
    };

    AsyncStorage.setItem("@settings", JSON.stringify(settings));

    return setting;
  }
);
