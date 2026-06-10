import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ title, value, change, desc }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}>
          {change}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900">{value}</span>
      </div>
      <p className="mt-1 text-xs text-slate-400">{desc}</p>
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowUpRight size={16} className="text-indigo-500" />
      </div>
    </div>
  );
}