import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import OptimizationPhases from "~/components/OptimizationPhases";
import ResumeDataDisplay from "~/components/ResumeDataDisplay";
import Summary from "~/components/Summary";
import Tabs from "~/components/Tabs";
import { usePuterStore } from "~/lib/puter";
import { useTheme } from "~/lib/useTheme";
import { OptimizationWorkflow } from "~/lib/optimizationWorkflow";
import clsx from "clsx";

export const meta = () => [
  { title: "Called to Work | Review" },
  { description: "Review your resume" },
];

const Resume = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [resumeModel, setResumeModel] = useState<ResumeModel | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const isDark = useTheme();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated)
      navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      // Load legacy resume data
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

      // Load structured resume model
      const resumeModelData = await kv.get(`resume_model:${id}`);
      if (resumeModelData) {
        const model = JSON.parse(resumeModelData) as ResumeModel;
        setResumeModel(model);
      }
    };
    loadResume();
  }, [id]);

  const handleStartOptimization = async () => {
    if (!resumeModel) return;

    setIsOptimizing(true);
    try {
      // Start optimization session
      await OptimizationWorkflow.startOptimizationSession(resumeModel, {
        companyName: resumeModel.optimization.targetCompany || "",
        jobTitle: resumeModel.optimization.targetJobTitle || "",
        jobDescription: "", // Would need to be stored separately
        industry: "Technology", // Would need to be determined
      });

      // Update resume model with session
      await kv.set(`resume_model:${id}`, JSON.stringify(resumeModel));

      // Navigate to optimization page (to be created)
      navigate(`/resume/${id}/optimize`);
    } catch (error) {
      console.error("Failed to start optimization:", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <main className="!pt-0 relative">
      {/* Navigation - Fixed at top */}
      <nav
        className={clsx("resume-nav fixed top-0 left-0 right-0 z-20", "fixed")}
      >
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" className="w-2.5 h-2.5" alt="Back" />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            Back to home page
          </span>
        </Link>
      </nav>

      {/* Main Content Container */}
      <div className="flex w-full max-lg:flex-col-reverse pt-16">
        {/* Fixed Resume Preview Section */}
        <section
          className={clsx(
            "resume-preview-section",
            isDark
              ? "dark-bg-blurred"
              : "bg-[url('/images/bg-small.svg')] bg-cover",
          )}
        >
          <div className="resume-image-container">
            {imageUrl && resumeUrl ? (
              <div className="resume-image-wrapper animate-in fade-in duration-1000">
                <div className="gradient-border w-full h-full max-w-[500px] max-h-[700px]">
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full h-full"
                  >
                    <img
                      src={imageUrl}
                      alt="Resume"
                      className="w-full h-full object-contain rounded-2xl"
                      title="Click to view full PDF"
                    />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <img
                  src="/images/resume-scan-2.gif"
                  className="w-64 h-64"
                  alt="Loading resume..."
                />
              </div>
            )}
          </div>
        </section>

        {/* Scrollable Analysis Section */}
        <section className="resume-analysis-section">
          <div className="flex flex-col gap-8 px-8 py-6">
            <h2
              className="text-4xl font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Resume Analysis
            </h2>
            {feedback ? (
              <div className="animate-in fade-in duration-1000">
                <Tabs
                  tabs={[
                    {
                      id: "analysis",
                      label: "Analysis",
                      content: (
                        <div className="space-y-6">
                          <Summary feedback={feedback} />
                          <ATS
                            score={feedback.ATS?.score || 0}
                            suggestions={feedback.ATS?.tips || []}
                          />
                          <Details feedback={feedback} />
                        </div>
                      ),
                    },
                    {
                      id: "extracted-data",
                      label: "Extracted Data",
                      content: (
                        <div className="space-y-6">
                          {resumeModel ? (
                            <ResumeDataDisplay resumeModel={resumeModel} />
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              No extracted data available
                            </div>
                          )}
                        </div>
                      ),
                    },
                    {
                      id: "improvement",
                      label: "Improvement",
                      content: (
                        <div className="space-y-6">
                          <OptimizationPhases
                            resumeModel={resumeModel}
                            onStartOptimization={handleStartOptimization}
                            isOptimizing={isOptimizing}
                          />
                        </div>
                      ),
                    },
                  ]}
                  defaultTab="analysis"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center py-20">
                <img
                  src="/images/resume-scan-2.gif"
                  className="w-full max-w-md"
                  alt="Analyzing resume..."
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Resume;
