export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-amber-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="mt-4 text-gray-500 font-medium">{text}</p>
    </div>
  );
}
