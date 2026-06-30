"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAdminToast } from "@/components/admin/hooks/useAdminToast";
import {
  CrudListModule,
  formatTagsInput,
  parseTagsInput,
} from "@/components/admin/modules/CrudListModule";
import { ProfileUpload } from "@/components/admin/modules/ProfileUpload";
import { SettingsFormModule } from "@/components/admin/modules/SettingsFormModule";
import { AdminToast } from "@/components/admin/shared/AdminToast";
import {
  AdminField,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminInputClass,
  adminTextareaClass,
} from "@/components/admin/shared/AdminField";
import { formatTilDate } from "@/lib/til";
import type { TilPayload } from "@/lib/til";

type AdminModule =
  | "overview"
  | "hero"
  | "about"
  | "achievements"
  | "experience"
  | "skills"
  | "projects"
  | "til"
  | "contact";

type TilItem = TilPayload & { id: string };

type AchievementItem = { id: string; year: string; title: string; description: string };
type ExperienceItem = {
  id: string;
  period: string;
  title: string;
  company: string;
  type: string;
  description: string;
  tags: string[];
};
type SkillItem = { id: string; label: string; value: string };
type ProjectItem = {
  id: string;
  num: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl: string | null;
};
type ContactLinkItem = { id: string; label: string; href: string; text: string };

type Stats = {
  achievements: number;
  experiences: number;
  skills: number;
  projects: number;
  til: number;
  links: number;
};

const NAV: { id: AdminModule; label: string; group: string }[] = [
  { id: "overview", label: "Overview", group: "General" },
  { id: "hero", label: "Hero", group: "Content" },
  { id: "about", label: "About & Profile", group: "Content" },
  { id: "achievements", label: "Achievements", group: "Content" },
  { id: "experience", label: "Experience", group: "Content" },
  { id: "skills", label: "Skills", group: "Content" },
  { id: "projects", label: "Projects", group: "Content" },
  { id: "til", label: "TIL", group: "Content" },
  { id: "contact", label: "Contact", group: "Content" },
];

const emptyTilForm: TilPayload = { date: "", title: "", description: "", codeSnippet: "" };

export function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeModule, setActiveModule] = useState<AdminModule>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState("/asdar.jpg");
  const [cvUrl, setCvUrl] = useState("/CV_Asdarium.pdf");
  const [tilEntries, setTilEntries] = useState<TilItem[]>([]);
  const [tilForm, setTilForm] = useState<TilPayload>(emptyTilForm);
  const [tilEditId, setTilEditId] = useState<string | null>(null);
  const { toast, showToast } = useAdminToast();

  const fetchTil = useCallback(async () => {
    const res = await fetch("/api/til");
    if (res.ok) setTilEntries(await res.json());
  }, []);

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/admin/stats");
    if (res.ok) setStats(await res.json());
  }, []);

  const fetchSettingsPreview = useCallback(async () => {
    const res = await fetch("/api/settings");
    if (res.ok) {
      const data = await res.json();
      setProfileImageUrl(data.profileImageUrl);
      setCvUrl(data.cvUrl);
    }
  }, []);

  const checkSession = useCallback(async () => {
    const res = await fetch("/api/admin/session");
    const data = await res.json();
    setAuthenticated(data.authenticated);
    if (data.authenticated) {
      fetchTil();
      fetchStats();
      fetchSettingsPreview();
    }
  }, [fetchTil, fetchStats, fetchSettingsPreview]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (authenticated && !tilForm.date) {
      setTilForm((f) => ({ ...f, date: new Date().toISOString().slice(0, 10) }));
    }
  }, [authenticated, tilForm.date]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      setPassword("");
      fetchTil();
      fetchStats();
      fetchSettingsPreview();
    } else {
      setLoginError("Invalid password. Please try again.");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    resetTilForm();
  }

  function resetTilForm() {
    setTilEditId(null);
    setTilForm({ ...emptyTilForm, date: new Date().toISOString().slice(0, 10) });
  }

  function startTilEdit(entry: TilItem) {
    setTilEditId(entry.id);
    setTilForm({
      date: entry.date,
      title: entry.title,
      description: entry.description,
      codeSnippet: entry.codeSnippet ?? "",
    });
    setActiveModule("til");
  }

  async function handleTilSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...tilForm, codeSnippet: tilForm.codeSnippet || null };
    const res = await fetch(tilEditId ? `/api/til/${tilEditId}` : "/api/til", {
      method: tilEditId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      showToast("Failed to save TIL.");
      return;
    }
    showToast(tilEditId ? "TIL updated." : "TIL published.");
    resetTilForm();
    fetchTil();
    fetchStats();
  }

  async function handleTilDelete(id: string, title: string) {
    if (!confirm(`Delete TIL "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/til/${id}`, { method: "DELETE" });
    if (!res.ok) {
      showToast("Failed to delete.");
      return;
    }
    if (tilEditId === id) resetTilForm();
    showToast("TIL deleted.");
    fetchTil();
    fetchStats();
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-xs uppercase text-ink-faded">
        Checking session...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md border-4 border-black bg-newsprint-accent p-8 shadow-hard">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded mb-2">Editorial Control Room</p>
          <h1 className="font-serif text-3xl font-black uppercase mb-2">Admin Access</h1>
          <p className="text-sm text-ink-faded mb-6">Sign in to manage your portfolio content.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <AdminField label="Password" htmlFor="password">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={`${adminInputClass} bg-newsprint`}
                placeholder="Enter admin password"
              />
            </AdminField>
            {loginError && (
              <p className="font-mono text-xs text-red-800 border-2 border-red-800 bg-red-50 px-3 py-2">{loginError}</p>
            )}
            <button type="submit" className={`${adminButtonPrimaryClass} w-full`}>
              Enter Dashboard
            </button>
          </form>
          <Link href="/" className="block text-center font-sans text-xs uppercase tracking-widest mt-6 hover:underline">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const navGroups = [...new Set(NAV.map((item) => item.group))];

  function renderModule() {
    switch (activeModule) {
      case "overview":
        return (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[
                { label: "Achievements", value: stats?.achievements ?? 0 },
                { label: "Experience", value: stats?.experiences ?? 0 },
                { label: "Skills", value: stats?.skills ?? 0 },
                { label: "Projects", value: stats?.projects ?? 0 },
                { label: "TIL Posts", value: stats?.til ?? 0 },
                { label: "Contact Links", value: stats?.links ?? 0 },
              ].map((card) => (
                <div key={card.label} className="border-4 border-black bg-newsprint-accent p-5 shadow-hard">
                  <p className="font-sans text-xs uppercase tracking-widest text-ink-faded mb-1">{card.label}</p>
                  <p className="font-serif text-3xl font-black">{card.value}</p>
                </div>
              ))}
            </div>
            <div className="border-4 border-black bg-newsprint p-6 shadow-hard">
              <h2 className="font-serif text-2xl font-black uppercase mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                {NAV.filter((n) => n.id !== "overview").map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveModule(item.id)}
                    className={adminButtonSecondaryClass}
                  >
                    Manage {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case "hero":
        return (
          <SettingsFormModule
            title="Hero Section"
            subtitle="Front Page"
            onSaved={showToast}
            fields={[
              { key: "heroEyebrow", label: "Eyebrow Text", type: "text" },
              { key: "heroHeadlines", label: "Headlines (one per line)", type: "lines", rows: 3 },
              { key: "heroName", label: "Name", type: "text" },
              { key: "heroTagline", label: "Tagline", type: "textarea", rows: 3 },
              { key: "statYears", label: "Stat 1 — Value", type: "text" },
              { key: "statYearsLabel", label: "Stat 1 — Label", type: "text" },
              { key: "statProjects", label: "Stat 2 — Value", type: "text" },
              { key: "statProjectsLabel", label: "Stat 2 — Label", type: "text" },
              { key: "statShipped", label: "Stat 3 — Value", type: "text" },
              { key: "statShippedLabel", label: "Stat 3 — Label", type: "text" },
            ]}
          />
        );
      case "about":
        return (
          <div className="space-y-8">
            <section className="border-4 border-black bg-newsprint p-6 shadow-hard">
              <p className="font-mono text-xs text-ink-faded mb-1">Media</p>
              <h2 className="font-serif text-2xl font-black uppercase border-b-4 border-double border-black pb-3 mb-6">
                Profile & CV
              </h2>
              <ProfileUpload
                profileImageUrl={profileImageUrl}
                cvUrl={cvUrl}
                onUploaded={showToast}
                onSettingsUpdate={(profile, cv) => {
                  setProfileImageUrl(profile);
                  setCvUrl(cv);
                }}
              />
            </section>
            <SettingsFormModule
              title="About Section"
              subtitle="Biography"
              onSaved={showToast}
              fields={[
                { key: "aboutParagraph1", label: "Paragraph 1", type: "textarea", rows: 5 },
                { key: "aboutParagraph2", label: "Paragraph 2", type: "textarea", rows: 5 },
                { key: "aboutParagraph3", label: "Paragraph 3", type: "textarea", rows: 5 },
                { key: "aboutSignature", label: "Signature", type: "text" },
                { key: "profileCaption", label: "Photo Caption", type: "text" },
                { key: "footerCopyright", label: "Footer Copyright", type: "text" },
              ]}
            />
          </div>
        );
      case "achievements":
        return (
          <CrudListModule<AchievementItem>
            title="Achievement"
            endpoint="/api/achievements"
            emptyLabel="No achievements yet."
            onSaved={showToast}
            fields={[
              { key: "year", label: "Year", type: "text", required: true },
              { key: "title", label: "Title", type: "text", required: true, maxLength: 120 },
              { key: "description", label: "Description", type: "textarea", required: true, rows: 4 },
            ]}
            getInitialForm={() => ({ year: "", title: "", description: "" })}
            itemToForm={(item) => ({
              year: item.year,
              title: item.title,
              description: item.description,
            })}
            formToPayload={(form) => ({
              year: form.year,
              title: form.title,
              description: form.description,
            })}
            renderItem={(item) => (
              <>
                <span className="font-mono text-[10px] uppercase text-ink-faded">{item.year}</span>
                <h3 className="font-serif font-bold text-sm mt-1 mb-1">{item.title}</h3>
                <p className="text-xs text-ink-faded">{item.description}</p>
              </>
            )}
          />
        );
      case "experience":
        return (
          <CrudListModule<ExperienceItem>
            title="Experience"
            endpoint="/api/experience"
            emptyLabel="No experience entries yet."
            onSaved={showToast}
            fields={[
              { key: "period", label: "Period", type: "text", required: true },
              { key: "title", label: "Job Title", type: "text", required: true },
              { key: "company", label: "Company", type: "text", required: true },
              { key: "type", label: "Type (e.g. FULL-TIME)", type: "text", required: true },
              { key: "description", label: "Description", type: "textarea", required: true, rows: 4 },
              { key: "tags", label: "Tags", type: "tags" },
            ]}
            getInitialForm={() => ({ period: "", title: "", company: "", type: "", description: "", tags: "" })}
            itemToForm={(item) => ({
              period: item.period,
              title: item.title,
              company: item.company,
              type: item.type,
              description: item.description,
              tags: formatTagsInput(item.tags),
            })}
            formToPayload={(form) => ({
              period: form.period,
              title: form.title,
              company: form.company,
              type: form.type,
              description: form.description,
              tags: parseTagsInput(form.tags),
            })}
            renderItem={(item) => (
              <>
                <p className="font-mono text-[10px] uppercase text-ink-faded">{item.period}</p>
                <h3 className="font-serif font-bold text-sm mt-1">{item.title}</h3>
                <p className="text-xs text-ink-faded">{item.company} · {item.type}</p>
              </>
            )}
          />
        );
      case "skills":
        return (
          <CrudListModule<SkillItem>
            title="Skill Group"
            endpoint="/api/skills"
            emptyLabel="No skill groups yet."
            onSaved={showToast}
            fields={[
              { key: "label", label: "Category", type: "text", required: true },
              { key: "value", label: "Technologies", type: "text", required: true },
            ]}
            getInitialForm={() => ({ label: "", value: "" })}
            itemToForm={(item) => ({ label: item.label, value: item.value })}
            formToPayload={(form) => ({ label: form.label, value: form.value })}
            renderItem={(item) => (
              <>
                <p className="font-sans text-xs uppercase tracking-widest text-ink-faded">{item.label}</p>
                <p className="font-serif font-bold text-sm mt-1">{item.value}</p>
              </>
            )}
          />
        );
      case "projects":
        return (
          <div className="space-y-8">
            <SettingsFormModule
              title="Projects Header"
              subtitle="GitHub Link"
              onSaved={showToast}
              fields={[{ key: "projectsGithubUrl", label: "View All on GitHub URL", type: "text" }]}
            />
            <CrudListModule<ProjectItem>
              title="Project"
              endpoint="/api/projects"
              emptyLabel="No projects yet."
              onSaved={showToast}
              fields={[
                { key: "num", label: "Number Label", type: "text", required: true },
                { key: "category", label: "Category", type: "text", required: true },
                { key: "title", label: "Title", type: "text", required: true },
                { key: "description", label: "Description", type: "textarea", required: true, rows: 4 },
                { key: "tags", label: "Tags", type: "tags" },
                { key: "repoUrl", label: "Repository URL", type: "text" },
              ]}
              getInitialForm={() => ({ num: "", category: "", title: "", description: "", tags: "", repoUrl: "" })}
              itemToForm={(item) => ({
                num: item.num,
                category: item.category,
                title: item.title,
                description: item.description,
                tags: formatTagsInput(item.tags),
                repoUrl: item.repoUrl ?? "",
              })}
              formToPayload={(form) => ({
                num: form.num,
                category: form.category,
                title: form.title,
                description: form.description,
                tags: parseTagsInput(form.tags),
                repoUrl: form.repoUrl || null,
              })}
              renderItem={(item) => (
                <>
                  <p className="font-mono text-[10px] uppercase text-ink-faded">{item.num} · {item.category}</p>
                  <h3 className="font-serif font-bold text-sm mt-1">{item.title}</h3>
                </>
              )}
            />
          </div>
        );
      case "contact":
        return (
          <div className="space-y-8">
            <SettingsFormModule
              title="Contact Section"
              subtitle="Intro & Terminal"
              onSaved={showToast}
              fields={[
                { key: "contactHeadlines", label: "Headlines (one per line)", type: "lines", rows: 3 },
                { key: "contactIntro", label: "Intro Paragraph", type: "textarea", rows: 4 },
                { key: "contactEmail", label: "Primary Email", type: "text" },
                { key: "contactWhoami", label: "Terminal — whoami", type: "text" },
                { key: "contactStatus", label: "Terminal — status", type: "text" },
                { key: "contactLocation", label: "Terminal — location", type: "text" },
              ]}
            />
            <CrudListModule<ContactLinkItem>
              title="Contact Link"
              endpoint="/api/contact-links"
              emptyLabel="No contact links yet."
              onSaved={showToast}
              fields={[
                { key: "label", label: "Label", type: "text", required: true },
                { key: "href", label: "URL / mailto / tel", type: "text", required: true },
                { key: "text", label: "Display Text", type: "text", required: true },
              ]}
              getInitialForm={() => ({ label: "", href: "", text: "" })}
              itemToForm={(item) => ({ label: item.label, href: item.href, text: item.text })}
              formToPayload={(form) => ({ label: form.label, href: form.href, text: form.text })}
              renderItem={(item) => (
                <>
                  <p className="font-sans text-xs uppercase tracking-widest text-ink-faded">{item.label}</p>
                  <p className="font-mono text-xs mt-1">{item.text}</p>
                </>
              )}
            />
          </div>
        );
      case "til":
        return (
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-start">
            <section className="border-4 border-black bg-newsprint p-6 shadow-hard">
              <p className="font-mono text-xs text-ink-faded mb-1">{tilEditId ? "Editing" : "New Entry"}</p>
              <h2 className="font-serif text-2xl font-black uppercase border-b-4 border-double border-black pb-3 mb-6">
                {tilEditId ? "Edit TIL" : "Post TIL"}
              </h2>
              <form onSubmit={handleTilSubmit} className="space-y-5">
                <AdminField label="Date *" htmlFor="til-date">
                  <input
                    type="date"
                    id="til-date"
                    required
                    value={tilForm.date}
                    onChange={(e) => setTilForm({ ...tilForm, date: e.target.value })}
                    className={adminInputClass}
                  />
                </AdminField>
                <AdminField label="Concept / Title *" htmlFor="til-title">
                  <input
                    type="text"
                    id="til-title"
                    required
                    maxLength={120}
                    value={tilForm.title}
                    onChange={(e) => setTilForm({ ...tilForm, title: e.target.value })}
                    className={`${adminInputClass} font-serif`}
                  />
                </AdminField>
                <AdminField label="Description *" htmlFor="til-description" hint={`${tilForm.description.length}/500`}>
                  <textarea
                    id="til-description"
                    required
                    rows={4}
                    maxLength={500}
                    value={tilForm.description}
                    onChange={(e) => setTilForm({ ...tilForm, description: e.target.value })}
                    className={adminTextareaClass}
                  />
                </AdminField>
                <AdminField label="Code Snippet (optional)" htmlFor="til-code">
                  <input
                    type="text"
                    id="til-code"
                    maxLength={80}
                    value={tilForm.codeSnippet ?? ""}
                    onChange={(e) => setTilForm({ ...tilForm, codeSnippet: e.target.value })}
                    className={adminInputClass}
                  />
                </AdminField>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button type="submit" className={adminButtonPrimaryClass}>
                    {tilEditId ? "Update TIL" : "Publish TIL"}
                  </button>
                  {tilEditId && (
                    <button type="button" onClick={resetTilForm} className={adminButtonSecondaryClass}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </section>
            <section className="border-4 border-black bg-newsprint-accent p-6 shadow-hard">
              <h2 className="font-serif text-2xl font-black uppercase mb-6">All TIL Posts</h2>
              <div className="border-2 border-black divide-y-2 divide-black max-h-[640px] overflow-y-auto">
                {tilEntries.length === 0 && (
                  <div className="p-6 text-center font-mono text-xs uppercase text-ink-faded">No entries found.</div>
                )}
                {tilEntries.map((entry) => (
                  <article key={entry.id} className="p-4 bg-newsprint">
                    <div className="flex flex-wrap justify-between gap-2 mb-2">
                      <time className="font-mono text-[10px] uppercase text-ink-faded">{formatTilDate(entry.date)}</time>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => startTilEdit(entry)} className="font-sans text-[10px] uppercase tracking-widest border border-black px-2 py-0.5 bg-newsprint-accent hover:bg-black hover:text-newsprint transition-colors duration-150">
                          Edit
                        </button>
                        <button type="button" onClick={() => handleTilDelete(entry.id, entry.title)} className="font-sans text-[10px] uppercase tracking-widest border border-black px-2 py-0.5 hover:bg-black hover:text-newsprint transition-colors duration-150">
                          Delete
                        </button>
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-sm mb-1">{entry.title}</h3>
                    <p className="text-xs text-ink-faded">{entry.description}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-newsprint">
      <header className="border-b-4 border-double border-black bg-newsprint sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded">Asdarium Gazette</p>
            <h1 className="font-serif text-2xl md:text-3xl font-black uppercase">Portfolio CMS</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" target="_blank" className={`${adminButtonSecondaryClass} inline-block`}>
              View Site ↗
            </Link>
            <button type="button" onClick={handleLogout} className={adminButtonPrimaryClass}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[240px_1fr] gap-8 items-start">
          <aside className="border-4 border-black bg-newsprint-accent p-4 shadow-hard lg:sticky lg:top-28">
            {navGroups.map((group) => (
              <div key={group} className="mb-5 last:mb-0">
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faded mb-2 px-2">{group}</p>
                <nav className="space-y-1">
                  {NAV.filter((item) => item.group === group).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveModule(item.id)}
                      className={`w-full text-left font-sans text-xs uppercase tracking-widest px-3 py-2 border-2 transition-colors duration-150 ${
                        activeModule === item.id
                          ? "border-black bg-black text-newsprint"
                          : "border-transparent hover:border-black hover:bg-newsprint"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            ))}
          </aside>

          <main>{renderModule()}</main>
        </div>
      </div>

      <AdminToast message={toast} />
    </div>
  );
}