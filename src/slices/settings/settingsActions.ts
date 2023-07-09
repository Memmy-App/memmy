import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SettingsState } from "./settingsSlice";
import { RootState } from "../../../store";
import { writeToLog } from "../../helpers/LogHelper";

export const loadSettings = createAsyncThunk(
  "Settings/loadSettings",
  async () => {
    let settingsStr;

    try {
      settingsStr = await AsyncStorage.getItem("@Settings");
    } catch (e: any) {
      writeToLog("Error getting Settings.");
      writeToLog(e.toString());
      return null;
    }

    if (!settingsStr) {
      return null;
    }

    return JSON.parse(settingsStr) as SettingsState;
  }
);

export const setSetting = createAsyncThunk(
  "Settings/setSetting",
  async (setting: object, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const settings = {
      ...state.settings,
      ...setting,
    };

    AsyncStorage.setItem("@Settings", JSON.stringify(settings));

    return setting;
  }
);
