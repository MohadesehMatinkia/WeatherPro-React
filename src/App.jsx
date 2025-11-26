import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSearch, FiWind, FiDroplet, FiThermometer, FiNavigation, FiToggleLeft, FiToggleRight, FiActivity, FiHeart, FiList, FiTrash2 } from "react-icons/fi";
import { getCityCoordinates, getWeatherData, getCityNameByCoords } from "./api/weatherApi";
import { getWeatherDescription } from "./utils/weatherCodes";
import { getWeatherIcon } from "./utils/weatherIcons";
import ForecastList from "./components/ForecastList";
import HourlyForecast from "./components/HourlyForecast";

const WEATHER_THEMES = {
  sunny: { gradient: "from-[#f12711] via-[#f5af19] to-[#ff9966]", shadow: "shadow-orange-500/50" },
  cloudy: { gradient: "from-[#bdc3c7] via-[#2c3e50] to-[#bdc3c7]", shadow: "shadow-slate-500/50" },
  rainy: { gradient: "from-[#2193b0] via-[#6dd5ed] to-[#00c6ff]", shadow: "shadow-blue-500/50" },
  snowy: { gradient: "from-[#E0EAFC] via-[#CFDEF3] to-[#B8C6DB]", shadow: "shadow-cyan-200/50" },
  default: { gradient: "from-[#f12711] via-[#f5af19] to-[#ff9966]", shadow: "shadow-orange-500/50" }
};

function App() {
  const [isFocused, setIsFocused] = useState(false);
  const [city, setCity] = useState("Tehran");
  const [isCelsius, setIsCelsius] = useState(true);
  const [theme, setTheme] = useState(WEATHER_THEMES.sunny);
  const [coords, setCoords] = useState(null);
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("weatherFavs");
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavList, setShowFavList] = useState(false);

  useEffect(() => {
    localStorage.setItem("weatherFavs", JSON.stringify(favorites));
  }, [favorites]);

  const fetchWeather = async () => {
    let targetCoords = coords;
    let cityName = city;

    if (!targetCoords) {
      const cityData = await getCityCoordinates(city);
      targetCoords = { latitude: cityData.latitude, longitude: cityData.longitude };
      cityName = cityData.name;
    } 
    
    const weather = await getWeatherData(targetCoords.latitude, targetCoords.longitude);
    return { ...weather, cityInfo: { name: cityName } };
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["weather", city, coords],
    queryFn: fetchWeather,
    enabled: true,
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    if (data) {
      const code = data.current.weather_code;
      if (code <= 1) setTheme(WEATHER_THEMES.sunny);
      else if (code <= 48) setTheme(WEATHER_THEMES.cloudy);
      else if (code <= 67) setTheme(WEATHER_THEMES.rainy);
      else if (code <= 86) setTheme(WEATHER_THEMES.snowy);
      else setTheme(WEATHER_THEMES.rainy);
    }
  }, [data]);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      toast.info("در حال دریافت موقعیت...");
      navigator.geolocation.getCurrentPosition(async (position) => {
         const { latitude, longitude } = position.coords;
         try {
             const realCityName = await getCityNameByCoords(latitude, longitude);
             setCity(realCityName); 
             setCoords({ latitude, longitude });
             toast.success(`موقعیت شما: ${realCityName}`);
         } catch (e) {
             setCoords({ latitude, longitude });
             toast.success("موقعیت جغرافیایی دریافت شد");
         }
      }, (error) => {
        toast.error("دسترسی به موقعیت داده نشد.");
      });
    } else {
        toast.error("مروگر شما از مکان‌یابی پشتیبانی نمی‌کند.");
    }
  };

  const toggleFavorite = () => {
    if (!data) return;
    const cityName = data.cityInfo.name;
    if (favorites.includes(cityName)) {
      setFavorites(favorites.filter(c => c !== cityName));
      toast.info(`${cityName} حذف شد.`);
    } else {
      setFavorites([...favorites, cityName]);
      toast.success(`${cityName} ذخیره شد.`);
    }
  };

  const isFavorite = data && favorites.includes(data.cityInfo.name);
  const displayTemp = (temp) => isCelsius ? Math.round(temp) : Math.round(temp * 9/5 + 32);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] overflow-hidden selection:bg-cyan-500/30 text-right font-sans">
      <ToastContainer position="top-center" theme="dark" rtl />
      <div className="bg-noise"></div>
      <div className="absolute inset-0 bg-grid-pattern z-0"></div>

      {/* --- پس‌زمینه متحرک --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-all duration-1000">
         
         {/* دایره‌های سمت چپ (قدیمی) */}
         <div className={`absolute top-0 -left-4 w-96 h-96 rounded-full mix-blend-screen opacity-20 animate-blob bg-gradient-to-tr ${theme.gradient}`}></div>
         <div className={`absolute -bottom-32 left-20 w-96 h-96 rounded-full mix-blend-screen opacity-20 animate-blob animation-delay-4000 bg-gradient-to-tl ${theme.gradient}`}></div>

         {/* --- دایره‌های جدید سمت راست (طبق درخواست شما) --- */}
         {/* دایره بالا راست */}
         <div className={`absolute top-[10%] right-[-5%] w-80 h-80 rounded-full mix-blend-screen opacity-30 blur-[100px] animate-blob animation-delay-2000 bg-gradient-to-br ${theme.gradient}`}></div>
         
         {/* دایره پایین راست */}
         <div className={`absolute bottom-[5%] right-[10%] w-64 h-64 rounded-full mix-blend-screen opacity-25 blur-[90px] animate-blob bg-gradient-to-t ${theme.gradient}`}></div>

      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 md:px-6 flex flex-col items-center">
        
        <div className="flex justify-between items-center mb-6 px-2 w-full">
           <div className="flex gap-3">
             <button onClick={() => setIsCelsius(!isCelsius)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
               <span className={isCelsius ? "text-white font-bold" : "text-slate-600"}>°C</span>
               {isCelsius ? <FiToggleLeft size={22}/> : <FiToggleRight size={22}/>}
               <span className={!isCelsius ? "text-white font-bold" : "text-slate-600"}>°F</span>
             </button>
             
             <div className="relative">
               <button onClick={() => setShowFavList(!showFavList)} className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-all text-white shadow-lg border border-white/10">
                 <FiList size={20} />
               </button>
               
               {showFavList && (
                 <div className="absolute top-12 left-0 w-48 bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                   {favorites.length === 0 ? (
                     <p className="p-4 text-xs text-slate-500 text-center font-['Vazirmatn']">لیست خالی است</p>
                   ) : (
                     <div className="max-h-60 overflow-y-auto no-scrollbar">
                       {favorites.map(fav => (
                         <div key={fav} className="flex justify-between items-center p-3 hover:bg-white/5 border-b border-white/5 last:border-0">
                           <button onClick={() => { setCity(fav); setCoords(null); setShowFavList(false); }} className="text-sm text-white flex-1 text-left">
                             {fav}
                           </button>
                           <button onClick={() => setFavorites(favorites.filter(c => c !== fav))} className="text-red-400 hover:text-red-300">
                             <FiTrash2 size={14} />
                           </button>
                         </div>
                       ))}
                     </div>
                   )}
                 </div>
               )}
             </div>
           </div>

           <button onClick={handleLocationClick} className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-all text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10">
             <FiNavigation size={20} />
           </button>
        </div>

        <div 
          className={`
            relative w-full bg-white/[0.02] backdrop-blur-2xl border rounded-[3rem] p-8 md:p-10 transition-all duration-700
            ${isFocused 
               ? 'border-white/30 shadow-[0_0_80px_-10px_rgba(255,255,255,0.15)] bg-white/[0.04]' 
               : 'border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.05)]'}
          `}
        >
          
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
            
            <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2">
              
              <div className="relative group mb-6">
                <div className={`absolute inset-0 bg-gradient-to-tr ${theme.gradient} blur-2xl opacity-40 transition-all duration-1000 group-hover:opacity-60`}></div>
                <div className={`relative flex items-center justify-center w-28 h-28 rounded-[2rem] bg-gradient-to-tr ${theme.gradient} ${theme.shadow} transition-all duration-700 animate-levitate z-10 overflow-hidden border border-white/20 shadow-2xl`}>
                   <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-90"></div>
                   <div className="relative z-20 transform scale-110">
                     {isLoading ? <FiActivity className="animate-spin text-white text-4xl"/> : 
                      data ? getWeatherIcon(data.current.weather_code, 70) : 
                      getWeatherIcon(0, 70)}
                   </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                
                <div className="flex flex-row items-center gap-3">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-sm flex flex-row items-start justify-center gap-1">
                        {data ? data.cityInfo.name : (
                            <>
                            Weather
                            <div className="bg-white/10 border border-white/20 rounded-lg px-1.5 py-0.5 shadow-lg backdrop-blur-md -mt-1 md:-mt-2 ml-1">
                                <span className="text-sm md:text-xl font-bold tracking-tight text-white/90 block leading-none">PRO</span>
                            </div>
                            </>
                        )}
                    </h1>
                    
                    {data && (
                      <button 
                        onClick={toggleFavorite} 
                        className={`p-2 rounded-full transition-all ${isFavorite ? 'text-red-500 bg-red-500/10' : 'text-slate-500 hover:text-white hover:bg-white/10'}`}
                        title={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
                      >
                        <FiHeart size={24} fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                    )}
                </div>

                <p className="text-xl text-cyan-400 font-medium mt-3 font-['Vazirmatn']" dir="rtl">
                    {data ? getWeatherDescription(data.current.weather_code) : "جستجو کنید..."}
                </p>

              </div>

            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-6 pt-2">
               <div className="relative w-full group/input">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                    <FiSearch className="text-slate-400 group-focus-within/input:text-white transition-colors" size={22} />
                  </div>
                  <input 
                    type="text" 
                    dir="rtl"
                    value={city}
                    onChange={(e) => { setCity(e.target.value); setCoords(null); }}
                    onKeyDown={(e) => { if (e.key === "Enter") { refetch(); e.target.blur(); } }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="نام شهر را به انگلیسی بنویسید..." 
                    className="w-full bg-black/30 border border-white/10 text-right text-white placeholder-slate-500 rounded-2xl py-5 pl-12 pr-6 outline-none focus:border-white/40 focus:bg-black/50 focus:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all shadow-inner text-lg font-['Vazirmatn']"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center bg-white/[0.03] rounded-3xl p-5 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300">
                    <FiThermometer className="text-slate-400 mb-2" size={24} />
                    <span className="text-xs text-slate-500 mb-1 font-medium font-['Vazirmatn']">دما</span>
                    <span className="text-4xl font-bold text-white tracking-tighter drop-shadow-lg">
                      {data ? displayTemp(data.current.temperature_2m) : "--"}°
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-white/[0.03] rounded-3xl p-5 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300">
                    <FiDroplet className="text-slate-400 mb-2" size={24} />
                    <span className="text-xs text-slate-500 mb-1 font-medium font-['Vazirmatn']">رطوبت</span>
                    <span className="text-3xl font-bold text-white tracking-tighter drop-shadow-lg">
                      {data ? data.current.relative_humidity_2m : "--"}%
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between bg-white/[0.03] rounded-3xl p-5 px-8 border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300">
                     <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-2.5 rounded-full"><FiWind className="text-white" size={20}/></div>
                        <span className="text-sm text-slate-400 font-medium font-['Vazirmatn']">سرعت باد</span>
                     </div>
                     <span className="text-2xl font-bold text-white">
                       {data ? data.current.wind_speed_10m : "--"} <span className="text-sm font-normal text-slate-500 ml-1">km/h</span>
                     </span>
                  </div>
               </div>
            </div>

          </div>

          <div className="mt-8 space-y-6">
             {/* پیش‌بینی ساعتی */}
             {data && <HourlyForecast hourlyData={data.hourly} isCelsius={isCelsius} />}
             
             {/* پیش‌بینی روزانه */}
             {data && <ForecastList dailyData={data.daily} isCelsius={isCelsius} />}
          </div>

        </div>

        <div className="mt-8 text-center opacity-30 hover:opacity-100 transition-opacity duration-700 cursor-default">
          <p className="text-[11px] tracking-[0.2em] font-light text-slate-300 uppercase glow-text">
            Designed by Mohaddeseh‌ Matinkia
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;