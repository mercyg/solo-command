"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Idea {
  id: string;
  title: string;
  description: string;
  projects: string[];
  date: string;
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  useEffect(() => {
    const savedIdeas = localStorage.getItem("ideas");
    const savedProjects = localStorage.getItem("projects");
    if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
  }, []);

  useEffect(() => {
    localStorage.setItem("ideas", JSON.stringify(ideas));
  }, [ideas]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const idea: Idea = {
      id: Date.now().toString(),
      title: formData.get("title")?.toString() || "Untitled",
      description: formData.get("description")?.toString() || "",
      projects: selectedProjects,
      date: new Date().toLocaleDateString(),
    };
    
    setIdeas([idea, ...ideas]);
    setShowForm(false);
    setSelectedProjects([]);
    e.currentTarget.reset();
  };

  const handleDeleteIdea = (ideaId: string) => {
    if (confirm("Delete this idea?")) {
      setIdeas(ideas.filter(i => i.id !== ideaId));
    }
  };

  const toggleProject = (projectName: string) => {
    if (selectedProjects.includes(projectName)) {
      setSelectedProjects(selectedProjects.filter(p => p !== projectName));
    } else {
      setSelectedProjects([...selectedProjects, projectName]);
    }
  };

  const activeProjects = projects.filter((p: any) => !p.archived);

  return (
    <div className="min-h-screen bg-[#F5F1EA]">
      <header className="border-b border-[#E5DDD1] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <span className="font-light text-xl tracking-wide text-[#2C2420]">Solo Command</span>
          </Link>
          <nav className="flex gap-2">
            <Link href="/dashboard" className="px-5 py-2.5 hover:bg-[#F5F1EA] rounded-lg transition text-[#2C2420] font-light">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="bg-white rounded-3xl shadow-sm border border-[#E5DDD1] p-10 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-5xl">💡</span>
              <div>
                <h1 className="text-4xl font-normal text-[#2C2420]">Ideas</h1>
                <p className="text-[#6B5D52] font-light mt-1">Capture your thoughts and connect them to projects</p>
              </div>
            </div>
            {!showForm && (
              <button onClick={() => setShowForm(true)} className="px-8 py-4 bg-[#2C2420] text-[#F5F1EA] rounded-xl font-light hover:bg-[#3d3530] transition">
                + New Idea
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-3xl shadow-lg border border-[#E5DDD1] p-10 mb-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-normal text-[#2C2420]">New Idea</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6B5D52] hover:text-[#2C2420]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-lg font-normal mb-3 text-[#2C2420]">Title</label>
                <input type="text" name="title" required className="w-full p-5 border border-[#E5DDD1] rounded-2xl focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition bg-[#FDFCFA] font-light text-[#2C2420] placeholder:text-[#6B5D52]/50" placeholder="What's your idea?" />
              </div>
              <div>
                <label className="block text-lg font-normal mb-3 text-[#2C2420]">Description</label>
                <textarea name="description" className="w-full p-5 border border-[#E5DDD1] rounded-2xl focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition min-h-[200px] bg-[#FDFCFA] font-light text-[#2C2420] placeholder:text-[#6B5D52]/50" placeholder="Describe your idea in detail..." />
              </div>
              <div>
                <label className="block text-lg font-normal mb-3 text-[#2C2420]">🏷️ Link to Projects</label>
                {activeProjects.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {activeProjects.map((project: any) => (
                      <button key={project.name} type="button" onClick={() => toggleProject(project.name)} className={`px-5 py-3 rounded-xl font-light transition ${selectedProjects.includes(project.name) ? "bg-[#8B7355] text-white" : "bg-[#F5F1EA] text-[#2C2420] hover:bg-[#E5DDD1]"}`}>
                        {project.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#6B5D52] text-sm font-light">No projects yet. Create projects in the dashboard first.</p>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="px-10 py-4 bg-[#2C2420] text-[#F5F1EA] rounded-xl font-light hover:bg-[#3d3530] transition">Save Idea</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-10 py-4 bg-[#F5F1EA] rounded-xl font-light hover:bg-[#E5DDD1] transition text-[#2C2420]">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {ideas.length > 0 ? (
          <div className="space-y-6">
            {ideas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-3xl shadow-sm border border-[#E5DDD1] p-8 relative group">
                <button
                  onClick={() => handleDeleteIdea(idea.id)}
                  className="absolute top-6 right-6 p-2 text-[#6B5D52] hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                  title="Delete idea"
                >
                  🗑️
                </button>
                <div className="pr-12">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-normal text-[#2C2420]">{idea.title}</h3>
                    {idea.projects.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {idea.projects.map((project, i) => (
                          <span key={i} className="px-4 py-1.5 bg-[#8B7355]/10 text-[#8B7355] rounded-full text-sm font-light">{project}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-[#6B5D52] font-light whitespace-pre-wrap">{idea.description}</p>
                  <p className="text-sm text-[#8B7355] mt-4 font-light">{idea.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-[#E5DDD1] p-16 text-center">
            <div className="text-7xl mb-6 opacity-40">💡</div>
            <h3 className="text-2xl font-normal mb-3 text-[#2C2420]">No ideas yet</h3>
            <p className="text-[#6B5D52] mb-8 font-light">Start capturing your thoughts</p>
          </div>
        )}
      </div>
    </div>
  );
}
