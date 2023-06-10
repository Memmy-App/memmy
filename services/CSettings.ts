import {Settings} from "react-native";

class CSettings implements Settings {
    clearWatch(watchId: number): void {
        Settings.clearWatch(watchId);
    }

    get(key: string): any {
        Settings.get(key);
    }

    set(settings: object): void {
        Settings.set(settings);
    }

    watchKeys(keys: string | Array<string>, callback: () => void): number {
        return 0;
    }

    getJson(key): any {
        return JSON.stringify(Settings.get(key));
    }
}