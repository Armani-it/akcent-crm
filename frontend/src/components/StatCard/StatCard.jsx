export const StatCard = ({ title, value, icon, gradient }) => (
  <div
    className={`rounded-3xl p-4 md:p-6 text-white shadow-xl md:shadow-2xl ${gradient}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="opacity-80 text-lg font-semibold uppercase tracking-wide">
          {title}
        </p>
        <p className="text-3xl md:text-5xl font-black mt-2">{value}</p>
      </div>
      <div className="p-2 md:p-0 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg">
        {icon}
      </div>
    </div>
  </div>
);
