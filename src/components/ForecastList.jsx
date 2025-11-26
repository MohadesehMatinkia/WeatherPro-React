import React, { useRef } from "react";
import { getWeatherIcon } from "../utils/weatherIcons";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ForecastList = ({ dailyData, isCelsius }) => {
  if (!dailyData) return null;

  const scrollRef = useRef(null);
  const { time, weather_code, temperature_2m_max, temperature_2m_min } = dailyData;
  const convert = (temp) => isCelsius ? Math.round(temp) : Math.round(temp * 9/5 + 32);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 200;
      if (direction === 'left') current.scrollLeft -= scrollAmount;
      else current.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className="mt-8 w-full border-t border-white/10 pt-6 relative group/list">
      
      <div className="flex items-center justify-between mb-4 px-2">
        {/* فونت فارسی وزیر برای هدر */}
        <h3 className="text-white/90 text-sm font-light border-r-2 border-cyan-400 pr-2 font-['Vazirmatn']">
          پیش‌بینی ۷ روز آینده
        </h3>
        
        <div className="flex gap-2 opacity-0 group-hover/list:opacity-100 transition-opacity duration-300">
           <button onClick={() => scroll('right')} className="bg-white/10 p-1.5 rounded-full hover:bg-white/30 text-white transition-colors">
             <FiChevronRight size={14}/>
           </button>
           <button onClick={() => scroll('left')} className="bg-white/10 p-1.5 rounded-full hover:bg-white/30 text-white transition-colors">
             <FiChevronLeft size={14}/>
           </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth" 
        dir="rtl"
      >
        {time.map((date, index) => (
          <div 
            key={index} 
            className="min-w-[100px] flex flex-col items-center bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300 group"
          >
            <span className="text-xs text-slate-400 mb-2 font-light">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
            </span>
            
            <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
               {getWeatherIcon(weather_code[index], 32)}
            </div>

            <div className="flex gap-2 text-sm items-end">
              <span className="text-white font-bold text-lg">{convert(temperature_2m_max[index])}°</span>
              <span className="text-slate-500 text-xs mb-1 opacity-70">{convert(temperature_2m_min[index])}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastList;