import Link from "next/link";

export default function Home() {
  const currentHour = new Date().getHours();
  let greeting = "Good evening";
  let emoji = "🌙";
  
  if (currentHour < 12) {
    greeting = "Good morning";
    emoji = "☀️";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
    emoji = "🌤️";
  }

  return (
    <div className="min-h-screen bg-[#F5F1EA]">
      {/* Header */}
      <header className="border-b border-[#E5DDD1] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <span className="font-light text-xl tracking-wide text-[#2C2420]">Solo Command</span>
          </div>
          <nav className="flex gap-2">
            <Link href="/dashboard" className="px-5 py-2.5 hover:bg-[#F5F1EA] rounded-lg transition text-[#2C2420] font-light">
              Dashboard
            </Link>
            <Link href="/dashboard" className="px-5 py-2.5 bg-[#2C2420] text-[#F5F1EA] rounded-lg hover:bg-[#3d3530] transition font-light">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Greeting */}
          <div className="inline-flex items-center gap-3 bg-white px-8 py-4 rounded-full shadow-sm border border-[#E5DDD1]">
            <span className="text-2xl">{emoji}</span>
            <span className="text-base font-light text-[#6B5D52]">{greeting}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-7xl font-light leading-tight text-[#2C2420] tracking-tight">
            Your sanctuary for
            <span className="block mt-2 font-normal">juggling multiple projects</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-[#6B5D52] max-w-2xl mx-auto leading-relaxed font-light">
            Track daily progress, capture fleeting ideas, and find clarity across all your work. 
            A mindful space for solo developers.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center pt-8">
            <Link 
              href="/dashboard" 
              className="px-10 py-4 bg-[#2C2420] text-[#F5F1EA] rounded-xl font-light text-lg hover:bg-[#3d3530] transition shadow-lg"
            >
              Start Your First Standup
            </Link>
            <a 
              href="#features" 
              className="px-10 py-4 bg-white border border-[#E5DDD1] rounded-xl font-light text-lg hover:border-[#D5CCC1] transition text-[#2C2420]"
            >
              See How It Works
            </a>
          </div>

          {/* Feature Cards */}
          <div id="features" className="grid md:grid-cols-3 gap-8 pt-24">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#E5DDD1] hover:shadow-md transition">
              <div className="text-4xl mb-6">📝</div>
              <h3 className="text-xl font-normal mb-3 text-[#2C2420]">Daily Standups</h3>
              <p className="text-[#6B5D52] font-light leading-relaxed">
                Start each day with intention. Reflect on yesterday, plan today, note what's blocking you.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#E5DDD1] hover:shadow-md transition">
              <div className="text-4xl mb-6">💡</div>
              <h3 className="text-xl font-normal mb-3 text-[#2C2420]">Idea Capture</h3>
              <p className="text-[#6B5D52] font-light leading-relaxed">
                Quickly capture ideas without breaking flow. Your thoughts deserve a peaceful home.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#E5DDD1] hover:shadow-md transition">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-xl font-normal mb-3 text-[#2C2420]">Multi-Project View</h3>
              <p className="text-[#6B5D52] font-light leading-relaxed">
                Organize by project. Filter, search, and visualize momentum across your work.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-12 pt-24">
            <div className="text-center">
              <div className="text-5xl font-light text-[#8B7355]">2 min</div>
              <div className="text-[#6B5D52] mt-3 font-light">Daily check-in</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light text-[#8B7355]">∞</div>
              <div className="text-[#6B5D52] mt-3 font-light">Projects to track</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light text-[#8B7355]">100%</div>
              <div className="text-[#6B5D52] mt-3 font-light">Your data</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-light text-[#8B7355]">0</div>
              <div className="text-[#6B5D52] mt-3 font-light">Meetings needed</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5DDD1] mt-32 py-12 bg-white">
        <div className="container mx-auto px-6 text-center text-[#6B5D52] font-light">
          <p>Built with intention for solo developers ⚡</p>
        </div>
      </footer>
    </div>
  );
}
