import { motion } from "framer-motion";
import { DailyForecast, getWeatherEmoji } from "@/hooks/useWeather";
import { format, parseISO } from "date-fns";

interface Props {
  daily: DailyForecast[];
}

export function ForecastCard({ daily }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-3xl p-6"
    >
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
        7-Day Forecast
      </p>
      <div className="space-y-3">
        {daily.map((day, i) => (
          <div
            key={day.date}
            className={`flex items-center justify-between py-2 ${i < daily.length - 1 ? "border-b border-border/40" : ""}`}
          >
            <span className="text-sm text-secondary-foreground w-20">
              {i === 0 ? "Today" : format(parseISO(day.date), "EEE")}
            </span>
            <span className="text-2xl">{getWeatherEmoji(day.weathercode)}</span>
            <div className="flex gap-3 text-sm">
              <span className="text-muted-foreground">{Math.round(day.tempMin)}°</span>
              <span className="text-foreground font-medium">{Math.round(day.tempMax)}°</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
