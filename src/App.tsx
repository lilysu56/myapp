import React, { useState, useEffect } from "react";
import { SearchInput } from "./components/SearchInput";
import { StockCard } from "./components/StockCard";
import { StockChart } from "./components/StockChart";
import { getStockAnalysis } from "./services/geminiService";
import { Sparkles, TrendingUp, LayoutDashboard, Star, Info, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";

interface StockData {
  symbol: string;
  quote: any;
  profile: any;
}

export default function App() {
  const [searchResult, setSearchResult] = useState<StockData | null>(null);
  const [watchlist, setWatchlist] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load watchlist from local storage
  useEffect(() => {
    const saved = localStorage.getItem("watchlist");
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse watchlist");
      }
    }
  }, []);

  // Save watchlist to local storage
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const handleSearch = async (symbol: string) => {
    setIsLoading(true);
    setError(null);
    setAiAnalysis(null);
    try {
      const res = await fetch(`/api/stock/${symbol}`);
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        setSearchResult(null);
      } else if (!data.quote.c) {
        setError("Stock symbol not found.");
        setSearchResult(null);
      } else {
        setSearchResult({ symbol, ...data });
      }
    } catch (err) {
      setError("Failed to fetch stock data. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const addToWatchlist = (stock: StockData) => {
    if (!watchlist.find(s => s.symbol === stock.symbol)) {
      setWatchlist([...watchlist, stock]);
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(s => s.symbol !== symbol));
  };

  const handleGetAnalysis = async () => {
    if (!searchResult) return;
    setIsAnalyzing(true);
    const analysis = await getStockAnalysis(
      searchResult.symbol, 
      searchResult.profile.name || searchResult.symbol, 
      searchResult.quote
    );
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  // Generate mock chart data based on current price
  const generateChartData = (price: number) => {
    const data = [];
    let current = price * 0.95;
    for (let i = 0; i < 20; i++) {
      current = current + (Math.random() - 0.45) * (price * 0.02);
      data.push({
        time: `${9 + Math.floor(i/2)}:${(i%2)*30 || '00'}`,
        price: parseFloat(current.toFixed(2))
      });
    }
    data.push({ time: "Now", price });
    return data;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-black/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">US Stock Pulse</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500">
            <a href="#" className="text-zinc-900">Dashboard</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Markets</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">News</a>
          </div>
          <div className="flex items-center gap-4">
            <SearchInput onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Search Result & Main View */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3"
                >
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {searchResult ? (
                <motion.div
                  key={searchResult.symbol}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl border border-black/5 shadow-sm p-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      {searchResult.profile.logo && (
                        <img 
                          src={searchResult.profile.logo} 
                          alt={searchResult.symbol} 
                          className="w-16 h-16 rounded-2xl object-contain border border-black/5 p-2"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div>
                        <div className="flex items-center gap-3">
                          <h1 className="text-3xl font-bold tracking-tight">{searchResult.symbol}</h1>
                          <button 
                            onClick={() => addToWatchlist(searchResult)}
                            className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-amber-500 transition-colors"
                          >
                            <Star size={20} />
                          </button>
                        </div>
                        <p className="text-zinc-500 font-medium">{searchResult.profile.name || "Company Name"}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-4xl font-bold tabular-nums">
                        ${searchResult.quote.c.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <div className={cn(
                        "flex items-center justify-end gap-1 font-semibold mt-1",
                        searchResult.quote.d >= 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        <span>{searchResult.quote.d >= 0 ? "+" : ""}{searchResult.quote.d.toFixed(2)}</span>
                        <span>({searchResult.quote.dp.toFixed(2)}%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "High", value: searchResult.quote.h },
                      { label: "Low", value: searchResult.quote.l },
                      { label: "Open", value: searchResult.quote.o },
                      { label: "Prev Close", value: searchResult.quote.pc },
                    ].map((item) => (
                      <div key={item.label} className="bg-zinc-50 p-4 rounded-2xl">
                        <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider mb-1">{item.label}</p>
                        <p className="text-lg font-semibold tabular-nums">${item.value.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-black/5 pt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-lg">Price Action (Today)</h2>
                      <div className="flex gap-2">
                        {['1D', '1W', '1M', '1Y'].map(t => (
                          <button key={t} className={cn(
                            "px-3 py-1 rounded-lg text-xs font-bold",
                            t === '1D' ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                          )}>{t}</button>
                        ))}
                      </div>
                    </div>
                    <StockChart 
                      data={generateChartData(searchResult.quote.c)} 
                      color={searchResult.quote.d >= 0 ? "#10b981" : "#ef4444"} 
                    />
                  </div>

                  {/* AI Section */}
                  <div className="mt-8 pt-8 border-t border-black/5">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-amber-500" size={20} />
                        <h2 className="font-bold text-lg">AI Market Insight</h2>
                      </div>
                      {!aiAnalysis && (
                        <button 
                          onClick={handleGetAnalysis}
                          disabled={isAnalyzing}
                          className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
                        >
                          {isAnalyzing ? "Analyzing..." : "Generate Analysis"}
                        </button>
                      )}
                    </div>
                    
                    {aiAnalysis && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50/50 border border-amber-100 p-6 rounded-2xl"
                      >
                        <p className="text-zinc-700 leading-relaxed italic">"{aiAnalysis}"</p>
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-amber-600 font-bold uppercase tracking-widest">
                          <Info size={12} />
                          <span>AI-generated content for informational purposes only</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-zinc-200">
                  <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
                    <LayoutDashboard size={32} className="text-zinc-300" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">Welcome to Stock Pulse</h2>
                  <p className="text-zinc-500 max-w-md">Search for a US stock ticker above to see real-time data, interactive charts, and AI-powered market analysis.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Watchlist & Market Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Star className="text-amber-500 fill-amber-500" size={20} />
                  <h2 className="font-bold text-lg tracking-tight">Watchlist</h2>
                </div>
                <span className="text-xs font-bold text-zinc-400 bg-zinc-50 px-2 py-1 rounded-md">
                  {watchlist.length} STOCKS
                </span>
              </div>

              <div className="space-y-4">
                {watchlist.length > 0 ? (
                  watchlist.map((stock) => (
                    <StockCard
                      key={stock.symbol}
                      symbol={stock.symbol}
                      name={stock.profile.name}
                      price={stock.quote.c}
                      change={stock.quote.d}
                      changePercent={stock.quote.dp}
                      onRemove={() => removeFromWatchlist(stock.symbol)}
                      onClick={() => handleSearch(stock.symbol)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm text-zinc-400">Your watchlist is empty.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 text-white overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">Market Sentiment</h3>
                <p className="text-zinc-400 text-sm mb-6">Overall US market trend is currently bullish based on major indices.</p>
                <div className="space-y-4">
                  {[
                    { label: "S&P 500", value: "+1.2%", color: "bg-emerald-500" },
                    { label: "NASDAQ", value: "+1.8%", color: "bg-emerald-500" },
                    { label: "DOW JONES", value: "-0.2%", color: "bg-red-500" },
                  ].map(idx => (
                    <div key={idx.label} className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-500">{idx.label}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div className={cn("h-full", idx.color)} style={{ width: '70%' }}></div>
                        </div>
                        <span className="text-xs font-bold">{idx.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <TrendingUp size={120} className="absolute -bottom-8 -right-8 text-white/5 rotate-12" />
            </div>
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-black/5 text-center">
        <p className="text-xs text-zinc-400 font-medium">
          Data provided by Finnhub API. AI insights generated by Gemini. 
          <br />
          Disclaimer: This is not financial advice. Trading stocks involves significant risk.
        </p>
      </footer>
    </div>
  );
}
