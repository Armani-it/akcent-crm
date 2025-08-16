export const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      <span className="text-sm">Загрузка...</span>
    </div>
  );
};
