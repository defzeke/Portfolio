export default function Home() {
  const projects = [
    {
      title: "FrameIT",
      description: "A creative framing application",
      url: "https://frameit-beta-ten.vercel.app/",
      image: "/api/placeholder/400/300" 
    },
    {
      title: "ICPEP SE - PUP Website",
      description: "ICPEP SE - PUP Official Website",
      url: "https://icpepsepup.vercel.app/",
      image: "/api/placeholder/400/300" 
    },
    {
      title: "PyTracker",
      description: "Python tracking application (GitHub Repository)",
      url: "https://github.com/defzeke/PyTracker",
      image: "/api/placeholder/400/300" 
    },
    {
      title: "ICPEP SE - NCR Website",
      description: "ICPEP SE - NCR Official Website",
      url: "https://icpepsencr.vercel.app/",
      image: "/api/placeholder/400/300" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="py-12 px-6 text-center border-b border-gray-700">
        <h1 className="text-5xl font-bold text-white mb-2">My Temporary Portfolio</h1>
        <p className="text-gray-400 text-lg">Deployed Projects</p>
      </header>

      {/* Projects Grid */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-700 hover:border-blue-500"
            >
              {/* Project Image Placeholder */}
              <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-6xl font-bold opacity-30">
                  {project.title.charAt(0)}
                </span>
              </div>
              
              {/* Project Info */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h2>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300">
                  <span className="text-sm font-semibold">Visit Project</span>
                  <svg 
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t border-gray-700 mt-16">
        <p>© 2025 Ezekiel Bustamante. All rights reserved.</p>
      </footer>
    </div>
  );
}
