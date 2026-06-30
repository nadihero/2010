"use client";

import { useEffect, useState } from "react";
import { usePortfolioSettings } from "@/contexts/PortfolioSettingsContext";

type ProjectItem = {
  id: string;
  num: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl: string | null;
};

export default function Projects() {
  const { settings } = usePortfolioSettings();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data: ProjectItem[]) => setProjects(data))
      .catch(() => setError("Unable to load projects."))
      .finally(() => setLoading(false));
  }, []);

  const githubUrl = settings?.projectsGithubUrl ?? "https://github.com/nadihero";

  return (
    <section id="projects" className="py-16 md:py-20 px-4 border-b-2 border-black section-reveal">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-10">
          <div>
            <p className="font-mono text-xs text-ink-faded mb-1">05.</p>
            <h3 className="font-serif text-3xl md:text-4xl font-black uppercase double-border-bottom pb-3 inline-block">
              Featured Projects
            </h3>
          </div>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs uppercase tracking-widest hover:underline"
          >
            View All on GitHub →
          </a>
        </div>
        {loading && (
          <div className="font-mono text-xs uppercase text-ink-faded text-center">Loading projects...</div>
        )}
        {error && (
          <div className="p-6 text-center font-mono text-xs uppercase text-red-800 border-2 border-red-800 bg-red-50">
            {error}
          </div>
        )}
        {!loading && !error && projects.length === 0 && (
          <div className="font-mono text-xs uppercase text-ink-faded text-center">No projects yet.</div>
        )}
        {!loading && !error && projects.length > 0 && (
          <div className="space-y-10">
            {projects.map((project) => (
              <article key={project.id} className="card-vintage border-4 border-black bg-newsprint-accent p-6 md:p-8 shadow-hard">
                <div className="flex flex-wrap gap-4 items-start justify-between mb-4">
                  <span className="font-mono text-xs border-2 border-black px-2 py-0.5">{project.num}</span>
                  <span className="font-mono text-[10px] text-ink-faded">{project.category}</span>
                </div>
                <h4 className="font-serif text-2xl md:text-3xl font-black uppercase mb-3">{project.title}</h4>
                <p className="text-sm text-justify text-ink-faded leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-mono text-[10px] border border-black px-2 py-0.5 bg-newsprint">
                      {tag}
                    </span>
                  ))}
                </div>
                {(project.repoUrl ?? githubUrl) && (
                  <a
                    href={project.repoUrl ?? githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs uppercase tracking-widest border-b-2 border-black hover:bg-black hover:text-newsprint transition-colors duration-150 px-1"
                  >
                    View Repository →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}