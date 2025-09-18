import { WifiIcon } from '@heroicons/react/24/solid';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#020817] z-50 flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/stars-bg.svg')] opacity-20" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] opacity-20 translate-x-1/2 translate-y-1/2" />
      
      <div className="relative flex flex-col items-center">
        <div className="bg-blue-500/20 p-3 rounded-lg mb-4 animate-pulse">
          <WifiIcon className="h-12 w-12 text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          ADKIMS SYSTEMS
        </h1>
        <div className="mt-4 flex space-x-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}