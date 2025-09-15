import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Navbar from "~/components/Navbar";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Called to Work | Review" },
  { description: "Review your resume" },
];

const Resume = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume);
      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;

      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);

      setFeedback(data.feedback);
    };
    loadResume();
  }, [id]);

  return (
    <main className="h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-row w-full max-lg:flex-col-reverse h-screen">
        <section className="feedback-section h-full sticky top-0 items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--color-mantle), var(--color-base))' }}>
          {imageUrl && resumeUrl ? (
            <div className="animate-in fade-in duration-300 gradient-border max-sm:m-4 h-[85%] max-w-xl:h-fit w-fit shadow-2xl">
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="block">
                <img
                  src={imageUrl}
                  alt="Resume"
                  className="w-full h-full max-h-[80vh] object-contain rounded-2xl transition-transform duration-300 hover:scale-105"
                  title="Click to view full PDF"
                />
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[85%]">
              <img src="/images/resume-scan-2.gif" className="w-32 h-32 max-h-[80vh] rounded-2xl shadow-lg" />
            </div>
          )}
        </section>
        <section className="feedback-section p-8 overflow-y-auto">
          <h2 className="text-4xl font-bold mb-8" style={{ color: '#de9f7c' }}>Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-10 animate-in fade-in duration-300">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <img src="/images/resume-scan-2.gif" className="w-48 h-48 rounded-2xl shadow-lg" />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
