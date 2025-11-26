import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ساخت موتور کش‌ینگ (Caching Engine)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // وقتی تب عوض شد الکی رفرش نکن
      retry: 1, // اگر ارور داد ۱ بار تلاش مجدد کن
      staleTime: 1000 * 60 * 5, // دیتا تا ۵ دقیقه تازه میمونه (کش)
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)