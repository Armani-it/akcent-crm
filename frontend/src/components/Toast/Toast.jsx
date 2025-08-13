import { CheckCircle, Info, XCircle } from "lucide-react";

export const Toast = ({ message, type, isVisible }) => {
  let bgColor = "bg-gradient-to-r from-red-500 to-red-600";
  if (type === "success")
    bgColor = "bg-gradient-to-r from-green-500 to-green-600";
  else if (type === "info")
    bgColor = "bg-gradient-to-r from-blue-500 to-blue-600";

  return (
    <div
      className={`fixed top-6 right-6 px-4 py-3 md:px-6 md:py-4 rounded-xl text-white font-medium shadow-2xl transition-all duration-300 transform z-50 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
      } ${bgColor}`}
    >
      <div className="flex items-center gap-3">
        {type === "success" ? (
          <CheckCircle size={20} />
        ) : type === "info" ? (
          <Info size={20} />
        ) : (
          <XCircle size={20} />
        )}
        <span className="font-medium text-sm md:text-base">{message}</span>
      </div>
    </div>
  );
};
