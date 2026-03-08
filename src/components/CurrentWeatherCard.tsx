import { motion } from "framer-motion";
import { Wind, Droplets } from "lucide-react";
import { CurrentWeather, GeoResult, getWeatherDescription, getWeatherEmoji } from "@/hooks/useWeather";

interface Props {
  current: CurrentWeather;
  location: GeoResult;
}

export function CurrentWeatherCard({ current, location }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="glass-card rounded-3xl p-8 text-center"
    >
      <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
        {location.name}, {location.country}
      </p>

      <div className="text-7xl my-4">
        {getWeatherEmoji(current.weathercode, current.is_day)}
      </div>

      <p className="text-7xl font-light text-foreground tracking-tighter">
        {Math.round(current.temperature)}°
      </p>

      <p className="text-muted-foreground mt-2 text-lg">
        {getWeatherDescription(current.weathercode)}
      </p>

      <div className="flex justify-center gap-8 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-primary" />
          <span>{current.windspeed} km/h</span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-primary" />
          <span>{current.humidity}%</span>
        </div>
      </div>
    </motion.div>
  );
}
