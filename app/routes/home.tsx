import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useTheme } from "~/lib/useTheme";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import clsx from "clsx";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Called to Work" },
    { name: "description", content: "Helping the saints gain employment" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const isDark = useTheme();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [reanalyzingId, setReanalyzingId] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  const loadResumes = async () => {
    setLoadingResumes(true);
    const resumes = (await kv.list("resume:*", true)) as KVItem[];

    const parsedResumes = resumes?.map(
      (resume) => JSON.parse(resume.value) as Resume,
    );
    console.log(parsedResumes);
    setResumes(parsedResumes || []);
    setLoadingResumes(false);
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleReanalysisStart = (resumeId: string) => {
    setReanalyzingId(resumeId);
  };

  const handleReanalysisComplete = async (resumeId: string) => {
    console.log(`Reanalysis completed for resume ${resumeId}`);
    setReanalyzingId(null);
    // Reload resumes to show updated data
    await loadResumes();
  };

  return (
    <main
      className={clsx(
        isDark ? "dark-bg-blurred" : "bg-[url('/images/bg-main.svg')] bg-cover",
      )}
    >
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track your Applications & Resume Ratings</h1>
          {!loadingResumes && resumes.length === 0 ? (
            <h2>No resumes found, upload your resumes to get started</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
        )}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                onReanalysisStart={handleReanalysisStart}
                onReanalysisComplete={handleReanalysisComplete}
                isReanalyzing={reanalyzingId === resume.id}
              />
            ))}{" "}
          </div>
        )}
        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
