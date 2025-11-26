import axios from "axios";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// 1. تبدیل اسم شهر به مختصات (Search)
export const getCityCoordinates = async (cityName) => {
  const { data } = await axios.get(GEO_URL, {
    params: {
      name: cityName,
      count: 10,
      language: "en",
      format: "json",
    },
  });

  if (!data.results || data.results.length === 0) {
    throw new Error("شهر پیدا نشد! لطفا اسم را انگلیسی و صحیح وارد کنید.");
  }

  let bestMatch = data.results.find(
    (city) => city.name.toLowerCase() === cityName.toLowerCase()
  );

  if (!bestMatch) {
    bestMatch = data.results.sort((a, b) => (b.population || 0) - (a.population || 0))[0];
  }

  return bestMatch; 
};

// 2. دریافت آب و هوا (اصلاح شده: اضافه شدن بخش hourly)
export const getWeatherData = async (lat, lon) => {
  const { data } = await axios.get(WEATHER_URL, {
    params: {
      latitude: lat,
      longitude: lon,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
      hourly: "temperature_2m,weather_code", // <--- این خط اضافه شد (دریافت دما و وضعیت ساعتی)
      timezone: "auto",
      forecast_days: 7, 
    },
  });
  return data;
};

// 3. پیدا کردن نام شهر با مختصات
export const getCityNameByCoords = async (lat, lon) => {
  try {
    const { data } = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    return data.city || data.locality || "Your Location";
  } catch (error) {
    console.error("خطا در یافتن نام شهر:", error);
    return "Your Location";
  }
};