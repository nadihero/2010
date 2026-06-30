"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

type JobItem = {
  id: string;
  period: string;
  title: string;
  company: string;
  type: string;
  description: string;
  tags: string[];
};

type SkillItem = {
  id: string;
  label: string;
  value: string;
};

export default function Experience() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/experience"), fetch("/api/skills")])
      .then(async ([jobsRes, skillsRes]) => {
        if (!jobsRes.ok || !skillsRes.ok) throw new Error("Failed to load");
        const [jobsData, skillsData] = await Promise.all([jobsRes.json(), skillsRes.json()]);
        setJobs(jobsData);
        setSkills(skillsData);
      })
      .catch(() => setError("Unable to load experience."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section id="experience" className="py-16 md:py-20 px-4 border-b-2 border-black section-reveal">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader number="03." title="Work Experience" />
          {loading && (
            <div className="font-mono text-xs uppercase text-ink-faded text-center">Loading experience...</div>
          )}
          {error && (
            <div className="p-6 text-center font-mono text-xs uppercase text-red-800 border-2 border-red-800 bg-red-50">
              {error}
            </div>
          )}
          {!loading && !error && jobs.length === 0 && (
            <div className="font-mono text-xs uppercase text-ink-faded text-center">No experience entries yet.</div>
          )}
          {!loading && !error && jobs.length > 0 && (
            <div className="space-y-8">
              {jobs.map((job) => (
                <article key={job.id} className="card-vintage border-4 border-black bg-newsprint-accent p-6 md:p-8 shadow-hard">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <p className="font-mono text-xs uppercase text-ink-faded">{job.period}</p>
                      <h4 className="font-serif text-2xl font-bold uppercase mt-1">{job.title}</h4>
                      <p className="font-sans text-sm uppercase tracking-wider mt-1">{job.company}</p>
                    </div>
                    <span className="font-mono text-xs border-2 border-black px-3 py-1 bg-newsprint">{job.type}</span>
                  </div>
                  <p className="text-sm text-justify text-ink-faded leading-relaxed">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.tags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] border border-black px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="skills" className="py-16 md:py-20 px-4 border-b-2 border-black bg-black text-newsprint section-reveal">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeader number="04." title="Technical Arsenal" inverted />
          {!loading && !error && skills.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill) => (
                <div key={skill.id} className="border-2 border-newsprint p-5">
                  <p className="font-sans text-xs uppercase tracking-widest text-newsprint/60 mb-3">{skill.label}</p>
                  <p className="font-serif font-bold">{skill.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}