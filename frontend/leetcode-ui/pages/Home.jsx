export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 text-white font-sans">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-10 max-w-2xl text-center shadow-xl animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-4 animate-pulse">
          🚀 Welcome to <span className="text-sky-400 drop-shadow-lg">CodeCrack</span>
        </h1>
        <p className="text-lg text-slate-200 leading-relaxed">
          Sharpen your coding skills, crack interviews, and master every algorithm out there.
        </p>
      </div>
    </div>
  );
}
