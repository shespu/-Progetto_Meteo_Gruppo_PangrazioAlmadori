import i18n from "i18next";
import { initReactI18next } from "react-i18next";


i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  resources: {
    en: {
      translation: {
        search_city: "Search city...",
        weekly_weather: "Weekly forecast",
        weather_details: "Weather details",
        min: "Min",
        max: "Max",
        rain: "Rain",
        wind: "Wind",
        humidity: "Humidity",
        uv: "UV index",
        loading: "Loading...",
        no_data: "No data available",
      },
    },
  },
});

/**
 * Aggiunge una lingua SOLO se non esiste già
 */
export const addLanguage = (lng, translations) => {
  if (!i18n.hasResourceBundle(lng, "translation")) {
    i18n.addResourceBundle(lng, "translation", translations, true, true);
  }
};

export default i18n;