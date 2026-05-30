"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, Project } from "@/lib/supabase";
import ParallaxSection from "./ParallaxSection";
import ScrambleText from "./ScrambleText";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 80, damping: 18 },
    },
  };

  if (loading) {
    return (
      <section id="projects" className="py-20">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <div className="text-center text-white/60">Loading projects...</div>
        </div>
      </section>
    );
  }

  const activeProject = modalIndex !== null ? projects[modalIndex] : null;
  const activePhotos = activeProject ? getPhotos(activeProject) : [];

  return (
    <section id="projects" className="py-20">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <ScrambleText
              text="My Projects"
              className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--foreground-rgb))] mb-4 inline-block"
            />
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="w-20 h-1 mx-auto"
            style={{ background: "#5C6CFF" }}
          />
          <motion.p
            variants={itemVariants}
            className="mt-4 text-white/70 font-medium"
          >
            Here are some of my recent works
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.length === 0 ? (
          <div className="col-span-full text-center text-white/70 py-16">
            No projects available.
          </div>
        ) : projects.map((project, idx) => {
            const photos = getPhotos(project);
            return (
              <ParallaxSection
                key={project.id}
                offset={idx % 2 === 0 ? 15 : -15}
              >
                <motion.div
                  variants={itemVariants}
                  whileHover="hover"
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

                  {/* Thumbnail */}
                  <div
                    className="h-48 flex items-center justify-center overflow-hidden relative"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    {project.image_url ? (
                      <motion.img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{
                          type: "spring" as const,
                          stiffness: 220,
                          damping: 22,
                        }}
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

                  {/* Card body */}
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
                </motion.div>
              </ParallaxSection>
            );
          })}
        </motion.div>
      </div>

      {/* Gallery Modal */}
      <AnimatePresence>
        {modalOpen && activeProject && (
          <motion.div
            key="modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative max-w-3xl w-full"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
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
                {/* Photo area */}
                <div
                  className="relative bg-black"
                  style={{ minHeight: "300px" }}
                >
                  {activePhotos.length > 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={modalSlide}
                        src={activePhotos[modalSlide]}
                        alt={`${activeProject.title} photo ${modalSlide + 1}`}
                        className="w-full object-contain max-h-[60vh]"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.22 }}
                      />
                    </AnimatePresence>
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center text-white/40">
                      No photos
                    </div>
                  )}

                  {/* Prev / Next */}
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

                {/* Dot indicators */}
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

                {/* Info */}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
