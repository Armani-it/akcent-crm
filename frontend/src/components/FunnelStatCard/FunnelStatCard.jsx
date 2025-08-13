export const FunnelStatCard = ({ title, count, total, icon, colorClass }) => {
  const rate = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className={`p-5 rounded-2xl border-2 text-white ${colorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-base">{title}</h4>
        {icon}
      </div>
      <p className="text-4xl font-black">{count}</p>
      <div className="w-full bg-white/20 rounded-full h-1.5 mt-3">
        <div
          className="bg-white h-1.5 rounded-full"
          style={{ width: `${rate}%` }}
        ></div>
      </div>
      <p className="text-right text-xs font-semibold opacity-90 mt-1">
        {rate.toFixed(1)}% от всех заявок
      </p>
    </div>
  );
};
