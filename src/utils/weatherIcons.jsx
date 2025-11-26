import React from "react";
import { 
  WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiShowers 
} from "react-icons/wi";

// تابع انتخاب آیکون بر اساس کد WMO
export const getWeatherIcon = (code, size = 50) => {
  // سایز و کلاس عمومی
  const props = { size, className: "drop-shadow-lg filter" };

  // آفتابی (0, 1)
  if (code <= 1) return <WiDaySunny {...props} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />;
  
  // نیمه ابری و ابری (2, 3)
  if (code <= 3) return <WiCloudy {...props} className="text-gray-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" />;
  
  // مه (45, 48)
  if (code <= 48) return <WiFog {...props} className="text-slate-400 opacity-80" />;
  
  // باران ریز و معمولی (51-67)
  if (code <= 67) return <WiRain {...props} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]" />;
  
  // برف (71-77, 85, 86)
  if (code <= 86) return <WiSnow {...props} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />;
  
  // طوفان (95-99)
  if (code <= 99) return <WiThunderstorm {...props} className="text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]" />;
  
  // پیش‌فرض
  return <WiDaySunny {...props} className="text-yellow-400" />;
};