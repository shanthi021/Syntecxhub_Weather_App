import { useState } from "react";
import { Settings } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import { SearchBar } from "@/components/SearchBar";
import { CurrentWeatherCard } from "@/components/CurrentWeatherCard";
import { ForecastCard } from "@/components/ForecastCard";
import { SettingsPanel, useTheme } from "@/components/SettingsPanel";
import { motion, AnimatePresence } from "framer-motion";
import { CloudOff } from "lucide-react";

const Index = () => {
  const { current, daily, location, loading, error, fetchWeather } = useWeather();
  const [settingsOpen, setSettingsOpen] = useState(false);
  useTheme(); // ensure theme is applied on mount

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 gap-6 max-w-lg mx-auto">
      <div className="w-full flex items-center justify-between">
        <div className="w-10" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
          Weather
        </h1>
        <button
          onClick={() => setSettingsOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <SearchBar onSearch={fetchWeather} loading={loading} />

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-2xl p-6 text-center w-full"
          >
            <CloudOff className="w-10 h-10 text-destructive mx-auto mb-3" />
            <p className="text-destructive font-medium">{error}</p>
          </motion.div>
        )}

        {!error && current && location && (
          <motion.div key="weather" className="w-full space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CurrentWeatherCard current={current} location={location} />
            {daily.length > 0 && <ForecastCard daily={daily} />}
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="text-muted-foreground text-sm animate-pulse">Loading weather data...</div>
      )}

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Index;
