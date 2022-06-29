import { useReducer, useRef } from "react";
import { getForecasts } from "../api/getForecasts";
import { Card } from "../Card/Card";
import { CurrentDay } from "../CurrentDay/CurrentDay";
import { Forecast } from "../Forecast/Forecast";
import { Cache } from "../Cache/Cache";
import { SearchForm } from "../SearchForm/SearchForm";
import { Spinner } from "../Spinner/Spinner";
import {
    ApiResponse,
    CurrentDayData,
    ForecastDayData,
    LocationData,
} from "../types";

import styles from "./App.module.css";

type AppState = {
    loading: boolean;
    error: string | null;
    currentDay: CurrentDayData | null;
    forecast: ForecastDayData[];
    location: LocationData | null;
};

const inititalState: AppState = {
    loading: false,
    error: null,
    currentDay: null,
    forecast: [],
    location: null,
};

type AppAction =
    | { type: "REQUEST" }
    | { type: "RESPONSE"; payload: ApiResponse };

const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case "REQUEST":
            return { ...inititalState, loading: true };
        case "RESPONSE":
            return "error" in action.payload
                ? { ...inititalState, error: action.payload.error.message }
                : {
                      ...inititalState,
                      currentDay: action.payload.current,
                      location: action.payload.location,
                      forecast: action.payload.forecast.forecastday,
                  };
    }
};

export const App = () => {
    const [{ loading, error, location, forecast, currentDay }, dispatch] =
        useReducer(appReducer, inititalState);

    const cacheRef = useRef(new Cache<string, ApiResponse>());

    const onSearch = async (searchValue: string) => {
        const cachedValue = cacheRef.current.get(searchValue);
        if (cachedValue) {
            dispatch({ type: "RESPONSE", payload: cachedValue });
        } else {
            dispatch({ type: "REQUEST" });
            const payload = await getForecasts(searchValue);
            dispatch({ type: "RESPONSE", payload });
            // avoid caching network errors
            if (!("error" in payload) || payload.error.code !== null) {
                cacheRef.current.set(searchValue, payload);
            }
        }
    };

    return (
        <div className={styles.app}>
            <SearchForm
                onSearch={onSearch}
                disabled={loading}
                placeholder="Search the city"
                className={styles.form}
            />

            <CurrentDay
                className={styles.currentDay}
                day={currentDay}
                location={location}
            />

            <Forecast className={styles.forecast} forecast={forecast} />

            {error && <Card className={styles.error}>{error}</Card>}
            {loading && (
                <Spinner className={styles.spinner} data-testid="loading" />
            )}
        </div>
    );
};
