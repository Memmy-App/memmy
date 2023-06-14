import {createAsyncThunk} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Setting} from "./settingsSlice";

export const loadSettings = createAsyncThunk(
    "settings/loadSettings",
    async () => {
        const keys = await AsyncStorage.getAllKeys();

        const settings: Setting[] = [];

        for(const key of keys) {
            settings.push({
                key,
                value: await AsyncStorage.getItem(key)
            });
        }

        return settings;
    }
);

export const setSetting = createAsyncThunk(
    "settings/setSetting",
    async (setting: Setting) => {
        await AsyncStorage.setItem(setting.key, setting.value);
        return setting;
    }
);