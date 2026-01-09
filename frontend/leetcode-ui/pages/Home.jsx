export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 text-white font-sans relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-12 max-w-3xl text-center shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-purple-500/50">
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">⚡</div>
          <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
            Welcome to CodeCrack
          </h1>
        </div>
        <p className="text-xl text-slate-200 leading-relaxed mb-8">
          Sharpen your coding skills, ace technical interviews, and master
          algorithms with our comprehensive coding platform.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/problems"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white shadow-lg hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-300"
          >
            Start Coding 🚀
          </a>
          <a
            href="/register"
            className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/40 rounded-xl font-semibold text-white hover:bg-white/30 transform hover:scale-110 transition-all duration-300"
          >
            Sign Up Free
          </a>
        </div>
      </div>
    </div>
  );
}
