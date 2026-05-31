"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { supabase, Project } from "@/lib/supabase";
import ParallaxSection from "./ParallaxSection";
import ScrambleText from "./ScrambleText";
import { ScrollRevealGroup, ScrollRevealItem } from "./ScrollReveal";
import { pickAccentByKey } from "@/lib/accents";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [modalSlide, setModalSlide] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  function openModal(idx: number) {
    setModalIndex(idx);
    setModalSlide(0);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setModalSlide(0);
  }

  function getPhotos(project: Project): string[] {
    const all = [project.image_url, ...(project.image_urls || [])];
    return all.filter(
      (url, i, arr) => Boolean(url) && arr.indexOf(url) === i,
    ) as string[];
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!modalOpen || modalIndex === null) return;
      const project = projects[modalIndex];
      if (!project) return;
      const photos = getPhotos(project);
      if (photos.length === 0) return;
      if (e.key === "ArrowRight") setModalSlide((s) => (s + 1) % photos.length);
      if (e.key === "ArrowLeft")
        setModalSlide((s) => (s - 1 + photos.length) % photos.length);
      if (e.key === "Escape") closeModal();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [modalOpen, modalIndex, projects],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <section id="projects" className="py-20">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded-full bg-white/10 mx-auto" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-72 rounded-3xl bg-white/5" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const activeProject = modalIndex !== null ? projects[modalIndex] : null;
  const activePhotos = activeProject ? getPhotos(activeProject) : [];

  return (
    <section id="projects" className="py-20">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <ScrollRevealGroup className="text-center mb-16">
          <ScrollRevealItem index={0}>
            <ScrambleText
              text="My Projects"
              className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--foreground-rgb))] mb-4 inline-block"
            />
          </ScrollRevealItem>
          <ScrollRevealItem index={1}>
            <div
              className="w-20 h-1 mx-auto"
              style={{ background: "#5C6CFF" }}
            />
          </ScrollRevealItem>
          <ScrollRevealItem index={2}>
            <p className="mt-4 text-white/70 font-medium">
              Here are some of my recent works
            </p>
          </ScrollRevealItem>
        </ScrollRevealGroup>

        <ScrollRevealGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 ? (
          <div className="col-span-full text-center text-white/70 py-16">
            No projects available.
          </div>
        ) : projects.map((project, idx) => {
            const photos = getPhotos(project);
            return (
              <ScrollRevealItem key={project.id} index={idx % 6}>
              <ParallaxSection offset={idx % 2 === 0 ? 15 : -15}>
                <div
                  className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer will-change-transform border relative"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                  onMouseMove={(e) => {
                    const target = e.currentTarget as HTMLDivElement;
                    const rect = target.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    target.style.setProperty("--x", `${x}%`);
                    target.style.setProperty("--y", `${y}%`);
                  }}
                  onClick={() => openModal(idx)}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    style={{
                      background:
                        "radial-gradient(320px 140px at var(--x,50%) var(--y,50%), rgba(92,108,255,0.18), transparent 60%)",
                    }}
                  />

                  <div
                    className="relative h-48 flex items-center justify-center overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        priority={false}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover-scale"
                      />
                    ) : (
                      <svg
                        className="w-20 h-20 text-white/40"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    )}
                    {photos.length > 1 && (
                      <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {photos.length}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[rgb(var(--foreground-rgb))] mb-2">
                      {project.title}
                    </h3>
                    <p className="text-white/80 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => {
                        const chip = pickAccentByKey(`tech:${tech}`);
                        return (
                          <span
                            key={index}
                            className="px-3 py-1 text-black text-xs font-semibold rounded-full"
                            style={{ background: chip }}
                          >
                            {tech}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ParallaxSection>
              </ScrollRevealItem>
            );
          })}
        </ScrollRevealGroup>
      </div>

      {modalOpen && activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 modal-backdrop"
          onClick={closeModal}
        >
          <div
            className="relative max-w-3xl w-full modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute -top-10 right-0 z-50 text-white/70 hover:text-white transition-colors text-sm flex items-center gap-1"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close
            </button>

            <div className="bg-[#0b0b0b] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div
                className="relative bg-black min-h-[300px]"
              >
                {activePhotos.length > 0 ? (
                  <div
                    key={modalSlide}
                    className="relative w-full h-[60vh] min-h-[300px] modal-slide"
                  >
                    <Image
                      src={activePhotos[modalSlide]}
                      alt={`${activeProject.title} photo ${modalSlide + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority={false}
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 flex items-center justify-center text-white/40">
                    No photos
                  </div>
                )}

                {activePhotos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setModalSlide(
                          (s) =>
                            (s - 1 + activePhotos.length) %
                            activePhotos.length,
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors z-20"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setModalSlide((s) => (s + 1) % activePhotos.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors z-20"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm z-20">
                      {modalSlide + 1} / {activePhotos.length}
                    </div>
                  </>
                )}
              </div>

              {activePhotos.length > 1 && (
                <div className="flex justify-center gap-1.5 py-3 bg-[#0b0b0b]">
                  {activePhotos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setModalSlide(i)}
                      className={`rounded-full transition-all ${i === modalSlide ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/60"}`}
                    />
                  ))}
                </div>
              )}

              <div className="p-5">
                <h3 className="text-lg font-bold text-white">
                  {activeProject.title}
                </h3>
                <p className="text-white/70 mt-1 text-sm leading-relaxed">
                  {activeProject.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {activeProject.technologies.map((tech, i) => {
                    const chip = pickAccentByKey(`tech:${tech}`);
                    return (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-black text-xs font-semibold rounded-full"
                        style={{ background: chip }}
                      >
                        {tech}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
