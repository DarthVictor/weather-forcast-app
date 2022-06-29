import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";

import { App } from "./App";
import { SUCCESS_RESPONSE_MOCK } from "../api/mockedResponses";

describe("App", () => {
    fetchMock.enableMocks();

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it("renders and searches using cache", async () => {
        fetchMock.mockResponse(async (req: Request) =>
            JSON.stringify(SUCCESS_RESPONSE_MOCK)
        );

        render(<App />);

        fireEvent.change(screen.getByPlaceholderText("Search the city"), {
            target: { value: "moscow" },
        });
        userEvent.click(screen.getByTestId("search"));
        expect(screen.getByTestId("loading")).toBeInTheDocument();

        expect(await screen.findByText("Moscow")).toBeInTheDocument();
        expect(fetchMock).lastCalledWith(
            "https://api.weatherapi.com/v1/forecast.json?key=GET_KEY_ON_weatherapi.com&q=moscow&days=3&aqi=no&alerts=no"
        );

        fireEvent.change(screen.getByPlaceholderText("Search the city"), {
            target: { value: "paris" },
        });
        userEvent.click(screen.getByTestId("search"));

        expect(
            await screen.findByText("Wednesday, Jun 29")
        ).toBeInTheDocument();
        expect(fetchMock).lastCalledWith(
            "https://api.weatherapi.com/v1/forecast.json?key=GET_KEY_ON_weatherapi.com&q=paris&days=3&aqi=no&alerts=no"
        );

        fireEvent.change(screen.getByPlaceholderText("Search the city"), {
            target: { value: "moscow" },
        });
        userEvent.click(screen.getByTestId("search"));

        expect(await screen.findByText("Moscow")).toBeInTheDocument();
        expect(fetchMock).toBeCalledTimes(2);
    });

    it("shows error and avoids caching network errors, while caches logic errors", async () => {
        render(<App />);

        fetchMock.mockResponse(async (req: Request) => {
            if (req.url.includes("logic_error")) {
                return JSON.stringify({
                    error: {
                        code: 1006,
                        message: "No matching location found.",
                    },
                });
            } else if (req.url.includes("network_error")) {
                return Promise.reject();
            } else {
                return JSON.stringify(SUCCESS_RESPONSE_MOCK);
            }
        });

        fireEvent.change(screen.getByPlaceholderText("Search the city"), {
            target: { value: "network_error" }, // should not be cached
        });
        userEvent.click(screen.getByTestId("search"));
        expect(await screen.findByText("Network error")).toBeInTheDocument();
        expect(fetchMock).lastCalledWith(
            "https://api.weatherapi.com/v1/forecast.json?key=GET_KEY_ON_weatherapi.com&q=network_error&days=3&aqi=no&alerts=no"
        );

        fireEvent.change(screen.getByPlaceholderText("Search the city"), {
            target: { value: "moscow" },
        });
        userEvent.click(screen.getByTestId("search"));
        expect(screen.getByTestId("loading")).toBeInTheDocument();

        expect(await screen.findByText("Moscow")).toBeInTheDocument();
        expect(fetchMock).lastCalledWith(
            "https://api.weatherapi.com/v1/forecast.json?key=GET_KEY_ON_weatherapi.com&q=moscow&days=3&aqi=no&alerts=no"
        );

        fireEvent.change(screen.getByPlaceholderText("Search the city"), {
            target: { value: "logic_error" }, // should be cached
        });
        userEvent.click(screen.getByTestId("search"));

        expect(
            await screen.findByText("No matching location found.")
        ).toBeInTheDocument();
        expect(fetchMock).lastCalledWith(
            "https://api.weatherapi.com/v1/forecast.json?key=GET_KEY_ON_weatherapi.com&q=logic_error&days=3&aqi=no&alerts=no"
        );

        fireEvent.change(screen.getByPlaceholderText("Search the city"), {
            target: { value: "network_error" },
        });
        userEvent.click(screen.getByTestId("search"));

        expect(await screen.findByText("Network error")).toBeInTheDocument();
        expect(fetchMock).lastCalledWith(
            "https://api.weatherapi.com/v1/forecast.json?key=GET_KEY_ON_weatherapi.com&q=network_error&days=3&aqi=no&alerts=no"
        );

        fireEvent.change(screen.getByPlaceholderText("Search the city"), {
            target: { value: "logic_error" },
        });
        userEvent.click(screen.getByTestId("search"));

        expect(
            await screen.findByText("No matching location found.")
        ).toBeInTheDocument();
        expect(fetchMock).lastCalledWith(
            "https://api.weatherapi.com/v1/forecast.json?key=GET_KEY_ON_weatherapi.com&q=network_error&days=3&aqi=no&alerts=no"
        );

        expect(fetchMock).toBeCalledTimes(4);
    });
});
