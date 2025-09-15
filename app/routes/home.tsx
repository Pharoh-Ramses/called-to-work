import type { Route } from "./+types/home";
import Button from "~/components/Button";
import Navbar from "~/components/Navbar";
import PageHeader from "~/components/PageHeader";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Called to Work" },
    { name: "description", content: "Helping the saints gain employment" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
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
    loadResumes();
  }, []);

  return (
    <main className="home-main">
      <Navbar />
      <section className="main-section">
        <PageHeader
          title="Track your Applications & Resume Ratings"
          subtitle={
            !loadingResumes && resumes.length === 0
              ? "No resumes found, upload your resumes to get started"
              : "Review your submissions and check AI-powered feedback"
          }
          className="py-16"
        />
        {loadingResumes && (
          <div className="loading-section">
            <img src="/images/resume-scan-2.gif" className="w-[250px] rounded-2xl shadow-lg" />
          </div>
        )}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section animate-fade-in">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        {!loadingResumes && resumes.length === 0 && (
          <div className="upload-section">
            <Button as="link" to="/upload" variant="primary" size="xl">
              Upload Resume
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
