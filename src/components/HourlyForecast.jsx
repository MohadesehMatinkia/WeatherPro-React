import React, { useRef } from "react";
import { getWeatherIcon } from "../utils/weatherIcons";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HourlyForecast = ({ hourlyData, isCelsius }) => {
  if (!hourlyData) return null;

  const scrollRef = useRef(null);
  const { time, temperature_2m, weather_code } = hourlyData;
  
  // پیدا کردن ساعت فعلی و برش ۲۴ ساعت آینده
  const currentHourIndex = new Date().getHours(); 
  const next24Hours = time.slice(currentHourIndex, currentHourIndex + 24);

  const convert = (temp) => isCelsius ? Math.round(temp) : Math.round(temp * 9/5 + 32);

  // تابع اسکرول (دقیقاً مثل لیست ۷ روزه)
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;
      if (direction === 'left') current.scrollLeft -= scrollAmount;
      else current.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className="w-full mb-6 relative group/list">
      
      {/* --- هدر اصلاح شده (دقیقاً مثل لیست ۷ روزه) --- */}
      <div className="flex items-center justify-between mb-4 px-2">
        {/* متن با خط آبی سمت راست */}
        <h3 className="text-white/90 text-sm font-light border-r-2 border-cyan-400 pr-2 font-['Vazirmatn']">
          پیش‌بینی ۲۴ ساعت آینده
        </h3>
        
        {/* دکمه‌های اسکرول */}
        <div className="flex gap-2 opacity-0 group-hover/list:opacity-100 transition-opacity duration-300">
           <button onClick={() => scroll('right')} className="bg-white/10 p-1.5 rounded-full hover:bg-white/30 text-white transition-colors">
             <FiChevronRight size={14}/>
           </button>
           <button onClick={() => scroll('left')} className="bg-white/10 p-1.5 rounded-full hover:bg-white/30 text-white transition-colors">
             <FiChevronLeft size={14}/>
           </button>
        </div>
      </div>
      
      {/* لیست اسکرولی */}
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth" 
        dir="rtl"
      >
        {next24Hours.map((t, i) => {
          const index = currentHourIndex + i;
          const date = new Date(t);
          const hour = date.getHours();
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const hour12 = hour % 12 || 12;

          return (
            <div 
              key={i} 
              className="min-w-[70px] flex flex-col items-center bg-white/[0.02] border border-white/5 rounded-2xl p-3 hover:bg-white/[0.08] transition-all group"
            >
              <span className="text-[10px] text-slate-400 mb-2 font-light tracking-wider">
                {hour12} {ampm}
              </span>
              
              <div className="mb-2 transform group-hover:scale-110 transition-transform">
                 {getWeatherIcon(weather_code[index], 24)}
              </div>

              <span className="text-white font-bold text-sm">
                {convert(temperature_2m[index])}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;