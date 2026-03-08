import { useState, useEffect, useCallback } from "react";

export interface GeoResult {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  humidity: number;
  weathercode: number;
  is_day: number;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weathercode: number;
}

interface WeatherState {
  current: CurrentWeather | null;
  daily: DailyForecast[];
  location: GeoResult | null;
  loading: boolean;
  error: string | null;
}

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle",
  55: "Dense drizzle", 61: "Light rain", 63: "Rain", 65: "Heavy rain",
  71: "Light snow", 73: "Snow", 75: "Heavy snow", 77: "Snow grains",
  80: "Light showers", 81: "Showers", 82: "Heavy showers",
  85: "Light snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Severe thunderstorm",
};

export const getWeatherDescription = (code: number): string =>
  WMO_DESCRIPTIONS[code] ?? "Unknown";

export const getWeatherEmoji = (code: number, isDay: number = 1): string => {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code <= 2) return isDay ? "⛅" : "☁️";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "🌨️";
  return "⛈️";
};

export function useWeather() {
  const [state, setState] = useState<WeatherState>({
    current: null, daily: [], location: null, loading: false, error: null,
  });

  const fetchWeather = useCallback(async (city: string) => {
    setState(s => ({ ...s, loading: true, error: null }));

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      );
      if (!geoRes.ok) throw new Error("Failed to find location");
      const geoData = await geoRes.json();

      if (!geoData.results?.length) {
        throw new Error(`City "${city}" not found. Try another name.`);
      }

      const loc: GeoResult = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=relativehumidity_2m&timezone=auto`
      );
      if (!weatherRes.ok) throw new Error("Failed to fetch weather data");
      const weatherData = await weatherRes.json();

      const currentHourIndex = new Date().getHours();

      setState({
        current: {
          temperature: weatherData.current_weather.temperature,
          windspeed: weatherData.current_weather.windspeed,
          weathercode: weatherData.current_weather.weathercode,
          is_day: weatherData.current_weather.is_day,
          humidity: weatherData.hourly?.relativehumidity_2m?.[currentHourIndex] ?? 0,
        },
        daily: weatherData.daily.time.map((date: string, i: number) => ({
          date,
          tempMax: weatherData.daily.temperature_2m_max[i],
          tempMin: weatherData.daily.temperature_2m_min[i],
          weathercode: weatherData.daily.weathercode[i],
        })),
        location: { name: loc.name, country: loc.country, latitude: loc.latitude, longitude: loc.longitude },
        loading: false,
        error: null,
      });
    } catch (err) {
      setState(s => ({
        ...s, loading: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      }));
    }
  }, []);

  useEffect(() => {
    fetchWeather("London");
  }, [fetchWeather]);

  return { ...state, fetchWeather };
}
