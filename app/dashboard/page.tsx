"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Project {
  name: string;
  archived: boolean;
}

export default function Dashboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedProjectsForEntry, setSelectedProjectsForEntry] = useState<string[]>([]);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<"timeline" | "board">("timeline");

  // Load data from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("entries");
    const savedProjects = localStorage.getItem("projects");
    if (savedEntries) setEntries(JSON.parse(savedEntries));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);
  
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

  const filteredEntries = selectedProject 
    ? entries.filter(e => e.projects.includes(selectedProject))
    : entries;

  const activeProjects = projects.filter(p => !p.archived);
  const archivedProjects = projects.filter(p => p.archived);
  const displayProjects = showArchived ? projects : activeProjects;

  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const projectName = formData.get("projectName")?.toString().trim();
    
    if (projectName && !projects.some(p => p.name === projectName)) {
      const newProjects = [...projects, { name: projectName, archived: false }];
      setProjects(newProjects);
      localStorage.setItem("projects", JSON.stringify(newProjects));
      setShowNewProject(false);
      e.currentTarget.reset();
    }
  };

  const handleDeleteProject = (projectName: string) => {
    if (confirm(`Delete project "${projectName}"? All entries will keep their project tags.`)) {
      const newProjects = projects.filter(p => p.name !== projectName);
      setProjects(newProjects);
      localStorage.setItem("projects", JSON.stringify(newProjects));
      if (selectedProject === projectName) setSelectedProject(null);
    }
  };

  const handleRenameProject = (oldName: string, newName: string) => {
    if (newName.trim() && !projects.some(p => p.name === newName)) {
      const newProjects = projects.map(p => p.name === oldName ? { ...p, name: newName } : p);
      const newEntries = entries.map(e => ({
        ...e,
        projects: e.projects.map((p: string) => p === oldName ? newName : p)
      }));
      setProjects(newProjects);
      setEntries(newEntries);
      localStorage.setItem("projects", JSON.stringify(newProjects));
      localStorage.setItem("entries", JSON.stringify(newEntries));
      if (selectedProject === oldName) setSelectedProject(newName);
      setEditingProject(null);
    }
  };

  const handleArchiveProject = (projectName: string) => {
    const newProjects = projects.map(p => p.name === projectName ? { ...p, archived: !p.archived } : p);
    setProjects(newProjects);
    localStorage.setItem("projects", JSON.stringify(newProjects));
  };

  const moveProject = (index: number, direction: 'up' | 'down') => {
    const newProjects = [...projects];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < projects.length) {
      [newProjects[index], newProjects[newIndex]] = [newProjects[newIndex], newProjects[index]];
      setProjects(newProjects);
      localStorage.setItem("projects", JSON.stringify(newProjects));
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    if (confirm('Delete this entry? This action cannot be undone.')) {
      const newEntries = entries.filter(e => e.id !== entryId);
      setEntries(newEntries);
      localStorage.setItem("entries", JSON.stringify(newEntries));
    }
  };

  const toggleProjectForEntry = (projectName: string) => {
    if (selectedProjectsForEntry.includes(projectName)) {
      setSelectedProjectsForEntry(selectedProjectsForEntry.filter(p => p !== projectName));
    } else {
      setSelectedProjectsForEntry([...selectedProjectsForEntry, projectName]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const entry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      accomplished: formData.get("accomplished")?.toString().split("\n").filter(Boolean) || [],
      next: formData.get("next")?.toString().split("\n").filter(Boolean) || [],
      blockers: formData.get("blockers")?.toString().split("\n").filter(Boolean) || [],
      projects: selectedProjectsForEntry,
      notes: formData.get("notes")?.toString() || "",
    };
    
    const newEntries = [entry, ...entries];
    setEntries(newEntries);
    localStorage.setItem("entries", JSON.stringify(newEntries));
    setShowForm(false);
    setSelectedProjectsForEntry([]);
    e.currentTarget.reset();
  };

  const generateFakeData = () => {
    if (!confirm("This will generate demo data. Continue?")) return;

    const demoProjects = [
      { name: "E-commerce Platform", archived: false },
      { name: "Mobile App", archived: false },
      { name: "AI Chatbot", archived: false },
      { name: "Portfolio Website", archived: true },
      { name: "Blog System", archived: false },
    ];

    const demoEntries = [
      {
        id: "demo1",
        date: "2/14/2026",
        accomplished: [
          "Fixed user authentication bug",
          "Implemented payment gateway integration",
          "Updated API documentation"
        ],
        next: [
          "Add email notifications",
          "Test checkout flow",
          "Deploy to staging"
        ],
        blockers: ["Waiting on payment provider API keys"],
        projects: ["E-commerce Platform"],
        notes: "Good progress today. Payment integration was trickier than expected."
      },
      {
        id: "demo2",
        date: "2/13/2026",
        accomplished: [
          "Designed new home screen",
          "Set up navigation structure",
          "Integrated push notifications"
        ],
        next: [
          "Build profile screen",
          "Add offline mode",
          "Test on iOS"
        ],
        blockers: [],
        projects: ["Mobile App"],
        notes: "Design looks great, team loved the mockups!"
      },
      {
        id: "demo3",
        date: "2/12/2026",
        accomplished: [
          "Trained model on new dataset",
          "Improved response accuracy by 15%",
          "Added context awareness"
        ],
        next: [
          "Fine-tune on domain data",
          "Add multi-language support",
          "Optimize inference speed"
        ],
        blockers: ["GPU quota running low"],
        projects: ["AI Chatbot"],
        notes: "Model performance exceeded expectations!"
      },
      {
        id: "demo4",
        date: "2/11/2026",
        accomplished: [
          "Refactored blog component",
          "Added markdown support",
          "Set up CI/CD pipeline"
        ],
        next: [
          "Add comment system",
          "Implement SEO optimization"
        ],
        blockers: [],
        projects: ["Blog System"],
        notes: "Pipeline is working smoothly now."
      },
      {
        id: "demo5",
        date: "2/10/2026",
        accomplished: [
          "Brainstormed new features",
          "Reviewed competitor apps",
          "Sketched wireframes"
        ],
        next: [
          "Build shopping cart",
          "Add product search"
        ],
        blockers: ["Need designer feedback"],
        projects: ["E-commerce Platform", "Mobile App"],
        notes: "Planning session was very productive."
      }
    ];

    const demoIdeas = [
      {
        id: "idea1",
        title: "Add Dark Mode",
        description: "Users have been requesting a dark mode option. Should be a toggle in settings that persists across sessions.",
        projects: ["E-commerce Platform", "Mobile App"],
        date: "2/15/2026"
      },
      {
        id: "idea2",
        title: "Voice Commands",
        description: "Integrate voice recognition to allow hands-free interaction with the chatbot. Could be a premium feature.",
        projects: ["AI Chatbot"],
        date: "2/14/2026"
      },
      {
        id: "idea3",
        title: "Weekly Newsletter",
        description: "Auto-generate a newsletter from blog posts. Send to subscribers every Sunday.",
        projects: ["Blog System"],
        date: "2/13/2026"
      },
      {
        id: "idea4",
        title: "Referral Program",
        description: "Give users credits for referring friends. Track referrals and automate rewards.",
        projects: ["E-commerce Platform"],
        date: "2/12/2026"
      },
      {
        id: "idea5",
        title: "Analytics Dashboard",
        description: "Build admin dashboard to track user behavior, sales, and engagement metrics across all projects.",
        projects: [],
        date: "2/11/2026"
      }
    ];

    setProjects(demoProjects);
    setEntries(demoEntries);
    localStorage.setItem("projects", JSON.stringify(demoProjects));
    localStorage.setItem("entries", JSON.stringify(demoEntries));
    localStorage.setItem("ideas", JSON.stringify(demoIdeas));
    
    alert("✅ Demo data generated! Switch to Board view to see it organized by project.");
  };

  const clearAllData = () => {
    if (!confirm("This will delete ALL data. Are you sure?")) return;
    setProjects([]);
    setEntries([]);
    localStorage.removeItem("projects");
    localStorage.removeItem("entries");
    localStorage.removeItem("ideas");
    alert("🗑️ All data cleared!");
  };

  return (
    <div className="min-h-screen bg-[#F5F1EA]">
      <header className="border-b border-[#E5DDD1] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <span className="font-light text-xl tracking-wide text-[#2C2420]">Solo Command</span>
          </Link>
          <nav className="flex gap-2 items-center">
            <button onClick={generateFakeData} className="px-4 py-2 text-xs bg-[#8B7355] text-white rounded-lg hover:bg-[#6B5D52] transition font-light">
              🎲 Demo Data
            </button>
            <button onClick={clearAllData} className="px-4 py-2 text-xs border border-[#E5DDD1] rounded-lg hover:bg-red-50 hover:border-red-300 transition font-light text-[#6B5D52]">
              🗑️ Clear All
            </button>
            <Link href="/ideas" className="px-5 py-2.5 hover:bg-[#F5F1EA] rounded-lg transition text-[#2C2420] font-light">
              💡 Ideas
            </Link>
            <button onClick={() => setShowProjects(!showProjects)} className="px-5 py-2.5 hover:bg-[#F5F1EA] rounded-lg transition text-[#2C2420] font-light">
              Projects {projects.length > 0 && `(${projects.length})`}
            </button>
          </nav>
        </div>
      </header>

      {showProjects && (
        <div className="fixed inset-0 bg-[#2C2420]/30 z-40 backdrop-blur-sm" onClick={() => setShowProjects(false)}>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl p-8 overflow-y-auto border-l border-[#E5DDD1]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-normal text-[#2C2420]">Your Projects</h2>
              <button onClick={() => setShowProjects(false)} className="text-[#6B5D52] hover:text-[#2C2420] text-xl">✕</button>
            </div>
            <button onClick={() => setShowNewProject(true)} className="w-full mb-6 px-6 py-3.5 bg-[#2C2420] text-[#F5F1EA] rounded-xl font-light hover:bg-[#3d3530] transition">
              + New Project
            </button>
            {showNewProject && (
              <form onSubmit={handleAddProject} className="mb-6 p-5 bg-[#F5F1EA] rounded-xl">
                <input type="text" name="projectName" placeholder="Project name..." className="w-full px-4 py-3 border border-[#E5DDD1] rounded-lg mb-3 focus:ring-2 focus:ring-[#8B7355] focus:border-[#8B7355] outline-none bg-white font-light text-[#2C2420] placeholder:text-[#6B5D52]/50" autoFocus />
                <div className="flex gap-2">
                  <button type="submit" className="px-5 py-2.5 bg-[#2C2420] text-white rounded-lg text-sm font-light hover:bg-[#3d3530]">Add</button>
                  <button type="button" onClick={() => setShowNewProject(false)} className="px-5 py-2.5 bg-white border border-[#E5DDD1] rounded-lg text-sm font-light hover:bg-[#F5F1EA]">Cancel</button>
                </div>
              </form>
            )}
            
            {archivedProjects.length > 0 && (
              <button onClick={() => setShowArchived(!showArchived)} className="w-full mb-4 px-4 py-2 text-sm text-[#6B5D52] hover:bg-[#F5F1EA] rounded-lg transition font-light">
                {showArchived ? '📦 Hide' : '📦 Show'} Archived ({archivedProjects.length})
              </button>
            )}
            
            {displayProjects.length > 0 ? (
              <div className="space-y-2">
                <button onClick={() => { setSelectedProject(null); setShowProjects(false); }} className={`w-full text-left px-5 py-4 rounded-xl transition font-light ${!selectedProject ? "bg-[#2C2420] text-[#F5F1EA]" : "hover:bg-[#F5F1EA] text-[#2C2420]"}`}>
                  <div className="flex justify-between items-center">
                    <span>All Projects</span>
                    <span className="text-sm opacity-70">{entries.length}</span>
                  </div>
                </button>
                {displayProjects.map((project, index) => {
                  const count = entries.filter(e => e.projects.includes(project.name)).length;
                  const isEditing = editingProject === project.name;
                  return (
                    <div key={project.name} className={`rounded-xl transition ${selectedProject === project.name ? "bg-[#8B7355] text-white" : "hover:bg-[#F5F1EA] text-[#2C2420]"}`}>
                      {isEditing ? (
                        <div className="p-3">
                          <input
                            type="text"
                            defaultValue={project.name}
                            className="w-full px-3 py-2 border border-[#E5DDD1] rounded-lg mb-2 focus:ring-2 focus:ring-[#8B7355] outline-none bg-white font-light text-[#2C2420]"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleRenameProject(project.name, e.currentTarget.value);
                              } else if (e.key === 'Escape') {
                                setEditingProject(null);
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value.trim() && e.target.value !== project.name) {
                                handleRenameProject(project.name, e.target.value);
                              } else {
                                setEditingProject(null);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-3 py-3">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => moveProject(index, 'up')}
                              disabled={index === 0}
                              className="text-xs opacity-50 hover:opacity-100 disabled:opacity-20"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => moveProject(index, 'down')}
                              disabled={index === displayProjects.length - 1}
                              className="text-xs opacity-50 hover:opacity-100 disabled:opacity-20"
                            >
                              ▼
                            </button>
                          </div>
                          <button
                            onClick={() => { setSelectedProject(project.name); setShowProjects(false); }}
                            className="flex-1 text-left px-2 py-1 font-light"
                          >
                            <div className="flex justify-between items-center">
                              <span>{project.archived ? '📦' : '🏷️'} {project.name}</span>
                              <span className="text-sm opacity-70">{count}</span>
                            </div>
                          </button>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingProject(project.name)}
                              className="p-1.5 hover:bg-white/20 rounded text-xs"
                              title="Rename"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleArchiveProject(project.name)}
                              className="p-1.5 hover:bg-white/20 rounded text-xs"
                              title={project.archived ? "Unarchive" : "Archive"}
                            >
                              {project.archived ? '📤' : '📦'}
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.name)}
                              className="p-1.5 hover:bg-red-500/20 rounded text-xs"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 text-[#6B5D52]">
                <div className="text-5xl mb-4 opacity-50">🏷️</div>
                <p className="font-light">No projects yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="bg-white rounded-3xl shadow-sm border border-[#E5DDD1] p-10 mb-10">
          <div className="flex items-center gap-5 mb-6">
            <span className="text-6xl">{emoji}</span>
            <div>
              <h1 className="text-4xl font-normal text-[#2C2420]">{greeting}</h1>
              <p className="text-[#6B5D52] font-light mt-1">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="mt-6 px-8 py-4 bg-[#2C2420] text-[#F5F1EA] rounded-xl font-light hover:bg-[#3d3530] transition">
              + Add Today's Standup
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white rounded-3xl shadow-lg border border-[#E5DDD1] p-10 mb-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-normal text-[#2C2420]">Today's Check-in</h2>
              <button onClick={() => setShowForm(false)} className="text-[#6B5D52] hover:text-[#2C2420]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-lg font-normal mb-3 text-[#2C2420]">✓ What did you accomplish since last time?</label>
                <textarea name="accomplished" className="w-full p-5 border border-[#E5DDD1] rounded-2xl focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition min-h-[140px] bg-[#FDFCFA] font-light text-[#2C2420] placeholder:text-[#6B5D52]/50" placeholder="Enter each item on a new line..." />
              </div>
              <div>
                <label className="block text-lg font-normal mb-3 text-[#2C2420]">→ What will you work on today?</label>
                <textarea name="next" className="w-full p-5 border border-[#E5DDD1] rounded-2xl focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition min-h-[140px] bg-[#FDFCFA] font-light text-[#2C2420] placeholder:text-[#6B5D52]/50" placeholder="Enter each item on a new line..." />
              </div>
              <div>
                <label className="block text-lg font-normal mb-3 text-[#2C2420]">⚠️ Any blockers or issues?</label>
                <textarea name="blockers" className="w-full p-5 border border-[#E5DDD1] rounded-2xl focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition min-h-[120px] bg-[#FDFCFA] font-light text-[#2C2420] placeholder:text-[#6B5D52]/50" placeholder="Enter each blocker on a new line (or leave empty)..." />
              </div>
              <div>
                <label className="block text-lg font-normal mb-3 text-[#2C2420]">🏷️ Select Projects</label>
                {activeProjects.length > 0 ? (
                  <div className="flex flex-wrap gap-3 mb-4">
                    {activeProjects.map((project) => (
                      <button key={project.name} type="button" onClick={() => toggleProjectForEntry(project.name)} className={`px-5 py-3 rounded-xl font-light transition ${selectedProjectsForEntry.includes(project.name) ? "bg-[#8B7355] text-white" : "bg-[#F5F1EA] text-[#2C2420] hover:bg-[#E5DDD1]"}`}>
                        {project.name}
                      </button>
                    ))}
                  </div>
                ) : <p className="text-[#6B5D52] text-sm mb-4 font-light">No projects yet. Click "Projects" in the header to create one.</p>}
              </div>
              <div>
                <label className="block text-lg font-normal mb-3 text-[#2C2420]">📝 Additional notes (optional)</label>
                <textarea name="notes" className="w-full p-5 border border-[#E5DDD1] rounded-2xl focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355]/20 outline-none transition min-h-[100px] bg-[#FDFCFA] font-light text-[#2C2420] placeholder:text-[#6B5D52]/50" placeholder="Any other thoughts or context..." />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="px-10 py-4 bg-[#2C2420] text-[#F5F1EA] rounded-xl font-light hover:bg-[#3d3530] transition">Save Entry</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-10 py-4 bg-[#F5F1EA] rounded-xl font-light hover:bg-[#E5DDD1] transition text-[#2C2420]">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-normal text-[#2C2420]">
            {selectedProject ? `${selectedProject}` : "All Entries"}
          </h2>
          <div className="flex gap-2 bg-white rounded-xl border border-[#E5DDD1] p-1">
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-6 py-2 rounded-lg font-light transition ${viewMode === "timeline" ? "bg-[#2C2420] text-[#F5F1EA]" : "text-[#6B5D52] hover:bg-[#F5F1EA]"}`}
            >
              📋 Timeline
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`px-6 py-2 rounded-lg font-light transition ${viewMode === "board" ? "bg-[#2C2420] text-[#F5F1EA]" : "text-[#6B5D52] hover:bg-[#F5F1EA]"}`}
            >
              📊 Board
            </button>
          </div>
        </div>

        {/* Board View - By Project with Individual Tasks */}
        {viewMode === "board" && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {activeProjects.map((project) => {
                // Get all tasks from entries for this project
                const projectTasks: any[] = [];
                entries
                  .filter(e => e.projects.includes(project.name))
                  .forEach((entry) => {
                    // Add accomplished items
                    entry.accomplished.forEach((item: string) => {
                      projectTasks.push({
                        id: `${entry.id}-acc-${item}`,
                        text: item,
                        type: 'accomplished',
                        date: entry.date,
                        entryId: entry.id,
                      });
                    });
                    // Add next items
                    entry.next.forEach((item: string) => {
                      projectTasks.push({
                        id: `${entry.id}-next-${item}`,
                        text: item,
                        type: 'next',
                        date: entry.date,
                        entryId: entry.id,
                      });
                    });
                    // Add blockers
                    entry.blockers.forEach((item: string) => {
                      projectTasks.push({
                        id: `${entry.id}-block-${item}`,
                        text: item,
                        type: 'blocker',
                        date: entry.date,
                        entryId: entry.id,
                      });
                    });
                  });

                return (
                  <div key={project.name} className="flex-shrink-0 w-96 bg-white rounded-2xl border border-[#E5DDD1] p-6">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5DDD1]">
                      <h3 className="text-xl font-normal text-[#2C2420] flex items-center gap-2">
                        🏷️ {project.name}
                      </h3>
                      <span className="text-sm text-[#6B5D52] font-light">
                        {projectTasks.length}
                      </span>
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {projectTasks.length > 0 ? (
                        projectTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`rounded-xl p-4 hover:shadow-md transition group relative cursor-pointer ${
                              task.type === 'accomplished'
                                ? 'bg-green-50 border-2 border-green-200'
                                : task.type === 'blocker'
                                ? 'bg-red-50 border-2 border-red-200'
                                : 'bg-blue-50 border-2 border-blue-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xl flex-shrink-0">
                                {task.type === 'accomplished' ? '✅' : task.type === 'blocker' ? '⚠️' : '📌'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className={`font-light text-sm ${
                                  task.type === 'accomplished'
                                    ? 'text-green-800'
                                    : task.type === 'blocker'
                                    ? 'text-red-800'
                                    : 'text-blue-800'
                                }`}>
                                  {task.text}
                                </p>
                                <p className="text-xs text-[#6B5D52] mt-2 opacity-60">
                                  {task.date}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 text-[#6B5D52]">
                          <p className="text-sm font-light">No tasks yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Unassigned tasks */}
              {(() => {
                const unassignedTasks: any[] = [];
                entries
                  .filter(e => e.projects.length === 0)
                  .forEach((entry) => {
                    entry.accomplished.forEach((item: string) => {
                      unassignedTasks.push({
                        id: `${entry.id}-acc-${item}`,
                        text: item,
                        type: 'accomplished',
                        date: entry.date,
                      });
                    });
                    entry.next.forEach((item: string) => {
                      unassignedTasks.push({
                        id: `${entry.id}-next-${item}`,
                        text: item,
                        type: 'next',
                        date: entry.date,
                      });
                    });
                    entry.blockers.forEach((item: string) => {
                      unassignedTasks.push({
                        id: `${entry.id}-block-${item}`,
                        text: item,
                        type: 'blocker',
                        date: entry.date,
                      });
                    });
                  });

                return unassignedTasks.length > 0 ? (
                  <div className="flex-shrink-0 w-96 bg-white rounded-2xl border border-[#E5DDD1] p-6">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E5DDD1]">
                      <h3 className="text-xl font-normal text-[#6B5D52] flex items-center gap-2">
                        📦 Unassigned
                      </h3>
                      <span className="text-sm text-[#6B5D52] font-light">
                        {unassignedTasks.length}
                      </span>
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {unassignedTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`rounded-xl p-4 hover:shadow-md transition group relative cursor-pointer ${
                            task.type === 'accomplished'
                              ? 'bg-green-50 border-2 border-green-200'
                              : task.type === 'blocker'
                              ? 'bg-red-50 border-2 border-red-200'
                              : 'bg-blue-50 border-2 border-blue-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl flex-shrink-0">
                              {task.type === 'accomplished' ? '✅' : task.type === 'blocker' ? '⚠️' : '📌'}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`font-light text-sm ${
                                task.type === 'accomplished'
                                  ? 'text-green-800'
                                  : task.type === 'blocker'
                                  ? 'text-red-800'
                                  : 'text-blue-800'
                              }`}>
                                {task.text}
                              </p>
                              <p className="text-xs text-[#6B5D52] mt-2 opacity-60">
                                {task.date}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        )}

        {/* Timeline View */}
        {viewMode === "timeline" && filteredEntries.length > 0 ? (
          <div className="space-y-6">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="bg-white rounded-3xl shadow-sm border border-[#E5DDD1] p-8 relative group">
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="absolute top-6 right-6 p-2 text-[#6B5D52] hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                  title="Delete entry"
                >
                  🗑️
                </button>
                <div className="flex justify-between items-start mb-6 pr-12">
                  <h3 className="text-lg font-normal text-[#2C2420]">📅 {entry.date}</h3>
                  {entry.projects.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {entry.projects.map((project: string, i: number) => (
                        <span key={i} className="px-4 py-1.5 bg-[#8B7355]/10 text-[#8B7355] rounded-full text-sm font-light">{project}</span>
                      ))}
                    </div>
                  )}
                </div>
                {entry.accomplished.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-normal text-[#2C2420] mb-3">✓ Accomplished</h4>
                    <ul className="list-disc list-inside space-y-2 text-[#6B5D52] font-light">
                      {entry.accomplished.map((item: string, i: number) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
                {entry.next.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-normal text-[#2C2420] mb-3">→ Next Steps</h4>
                    <ul className="list-disc list-inside space-y-2 text-[#6B5D52] font-light">
                      {entry.next.map((item: string, i: number) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
                {entry.blockers.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-normal text-[#2C2420] mb-3">⚠️ Blockers</h4>
                    <ul className="list-disc list-inside space-y-2 text-[#6B5D52] font-light">
                      {entry.blockers.map((item: string, i: number) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>
                )}
                {entry.notes && (
                  <div className="mt-6 pt-6 border-t border-[#E5DDD1]">
                    <p className="text-[#6B5D52] italic font-light">{entry.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : viewMode === "timeline" && filteredEntries.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-[#E5DDD1] p-16 text-center">
            <div className="text-7xl mb-6 opacity-40">📝</div>
            <h3 className="text-2xl font-normal mb-3 text-[#2C2420]">No entries yet</h3>
            <p className="text-[#6B5D52] mb-8 font-light">Start by adding your first standup</p>
          </div>
        ) : viewMode === "board" && activeProjects.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-[#E5DDD1] p-16 text-center">
            <div className="text-7xl mb-6 opacity-40">🏷️</div>
            <h3 className="text-2xl font-normal mb-3 text-[#2C2420]">No projects yet</h3>
            <p className="text-[#6B5D52] mb-8 font-light">Create projects to organize your entries on a board</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
