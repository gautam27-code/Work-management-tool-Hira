function StatCard({ label, value, icon, gradient, delay = 0 }) {
  return (
    <div 
      className="bg-[#1e293b] rounded-2xl border border-[#334155] p-5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden animate-fade-in group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradient}`}></div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#94a3b8] text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-[#0f172a] shadow-inner text-white bg-gradient-to-br ${gradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;
