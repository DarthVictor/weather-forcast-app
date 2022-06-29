import { ApiResponse } from "../types";

export const getForecasts = async (
    searchValue: string
): Promise<ApiResponse> => {
    try {
        const res = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${process.env.REACT_APP_API_KEY}&q=${searchValue}&days=3&aqi=no&alerts=no`
        );
        return res.json();
    } catch (e) {
        return {
            error: {
                message: "Network error",
                code: null,
            },
        };
    }
};
