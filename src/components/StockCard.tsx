import React from "react";
import { TrendingUp, TrendingDown, Plus, Trash2, Loader2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

interface StockCardProps {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  onAdd?: () => void;
  onRemove?: () => void;
  onClick?: () => void;
  isWatchlist?: boolean;
}

export const StockCard: React.FC<StockCardProps> = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  onAdd,
  onRemove,
  onClick,
  isWatchlist,
}) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg text-zinc-900 tracking-tight">{symbol}</h3>
          {name && <p className="text-xs text-zinc-500 truncate max-w-[120px]">{name}</p>}
        </div>
        <div className="flex items-center gap-2">
          {onAdd && (
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <Plus size={18} />
            </button>
          )}
          {onRemove && (
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="p-1.5 rounded-full hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-end justify-between mt-4">
        <div>
          <p className="text-2xl font-semibold text-zinc-900 tabular-nums">
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
          isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
        )}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{isPositive ? "+" : ""}{changePercent.toFixed(2)}%</span>
        </div>
      </div>
    </motion.div>
  );
};
