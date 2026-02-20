export const Loader = () => {
  return (
    <div className="flex flex-col h-[50vh] w-full items-center justify-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-yellow-400 border-r-transparent animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-blue-500 border-l-transparent animate-spin direction-reverse"></div>
      </div>
      <span className="text-yellow-400 font-bold tracking-widest animate-pulse text-sm">
        LOADING...
      </span>
    </div>
  );
};